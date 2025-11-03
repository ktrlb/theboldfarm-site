import * as schema from './schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Lazy database initialization - only create when accessed at runtime
// This prevents Vercel from trying to provision resources during build
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> | null {
  // Return existing instance if already created
  if (dbInstance) {
    return dbInstance;
  }

  // Only initialize at runtime in API routes, never during build
  // Check environment to avoid initialization during build
  if (!process.env.VERCEL && process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }

  try {
    // Use require only when actually needed at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const postgres = require('postgres').default;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require('drizzle-orm/postgres-js');

    const queryClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    dbInstance = drizzle(queryClient, { schema });
    return dbInstance;
  } catch (error) {
    // Silently fail - API routes will handle null db
    return null;
  }
}

// Export as a getter function instead of calling it at module load
// This ensures it's only evaluated when actually accessed in API routes
// Vercel won't try to provision resources just because we import this module
export const db = (() => {
  // Return a proxy that only initializes when methods are accessed
  return new Proxy({} as PostgresJsDatabase<typeof schema>, {
    get(_target, prop: string | symbol) {
      const instance = getDb();
      if (!instance) {
        // Return undefined for methods - API routes check `if (!db)` first
        return undefined;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (instance as any)[prop];
    }
  });
})();

// Export schema for use in queries
export { schema };

// Explicit getter so API routes can safely detect missing DB configuration
export function getDbInstance(): PostgresJsDatabase<typeof schema> | null {
  return getDb();
}

