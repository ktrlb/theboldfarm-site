import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get Neon Postgres connection string
// Use the pooled URL for better performance
const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn('No Postgres connection string found. Database features will be unavailable.');
}

// Create postgres client with connection pooling
const queryClient = connectionString
  ? postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

// Create Drizzle instance
export const db = queryClient ? drizzle(queryClient, { schema }) : null;

// Export schema for use in queries
export { schema };

