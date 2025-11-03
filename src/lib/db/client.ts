import * as schema from './schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { ExtractTablesWithRelations } from 'drizzle-orm';

// Lazy database initialization - only create when accessed
// This prevents Vercel from trying to provision resources during build
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;
let initPromise: Promise<PostgresJsDatabase<typeof schema> | null> | null = null;

async function initializeDbAsync(): Promise<PostgresJsDatabase<typeof schema> | null> {
  if (dbInstance) {
    return dbInstance;
  }

  // Check if we're in a build context - skip during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    return null;
  }

  try {
    // Dynamic import - only loads at runtime, not during build
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const postgres = (await import('postgres')).default;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = await import('drizzle-orm/postgres-js');

    const queryClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    dbInstance = drizzle(queryClient, { schema });
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return null;
  }
}

function initializeDb(): PostgresJsDatabase<typeof schema> | null {
  // During build, return null immediately
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  // If we have a pending initialization, wait for it (synchronous return null for now)
  if (initPromise) {
    return null;
  }

  // Start async initialization but return null immediately
  initPromise = initializeDbAsync();
  initPromise.then((instance) => {
    dbInstance = instance;
    initPromise = null;
  }).catch(() => {
    initPromise = null;
  });

  return null;
}

// Export db with lazy getter - only initializes when first accessed
// This prevents any database code from running during build time
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop: string | symbol) {
    // During build, return null so API routes can check `if (!db)`
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null;
    }

    const instance = initializeDb();
    if (!instance) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (instance as any)[prop];
  }
});

// Export schema for use in queries
export { schema };

