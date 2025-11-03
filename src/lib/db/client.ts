import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy database connection - only create when actually needed (at runtime, not build time)
let queryClient: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  // Return existing instance if already created
  if (dbInstance) {
    return dbInstance;
  }

  // Only initialize at runtime, not during build
  // During build, environment variables might not be available
  const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    // Silent during build - API routes will handle the null case
    return null;
  }

  try {
    queryClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    dbInstance = drizzle(queryClient, { schema });
    return dbInstance;
  } catch (error) {
    // Only log in non-build environments
    if (process.env.VERCEL_ENV !== 'production' || !process.env.NEXT_PHASE) {
      console.error('Failed to initialize database connection:', error);
    }
    return null;
  }
}

// Export db - API routes will check for null
export const db = getDb();

// Export schema for use in queries
export { schema };

