import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('No database connection string found');
  process.exit(1);
}

async function migrateGoatsToAnimals() {
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    console.log('Starting migration from goats table to animals table...');

    // Check if animals table exists
    const animalsTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'animals'
      )
    `;
    
    const goatsTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'goats'
      )
    `;

    if (animalsTableExists[0].exists) {
      console.log('Animals table already exists. Skipping migration.');
      await sql.end();
      return;
    }

    if (!goatsTableExists[0].exists) {
      console.log('No goats table found. Animals table will be created by drizzle-kit push.');
      await sql.end();
      return;
    }

    console.log('Migrating goats table to animals table...');

    // Create animals table with new structure
    await sql`
      CREATE TABLE IF NOT EXISTS animals (
        id bigserial PRIMARY KEY,
        name text NOT NULL,
        animal_type text NOT NULL DEFAULT 'Goat',
        type text NOT NULL,
        birth_date text,
        birth_type text NOT NULL,
        price numeric(10, 2) NOT NULL DEFAULT 0,
        is_for_sale boolean NOT NULL DEFAULT false,
        registered boolean NOT NULL DEFAULT false,
        horn_status text,
        dam text,
        sire text,
        bio text NOT NULL DEFAULT '',
        status text NOT NULL DEFAULT 'Active',
        photos text[] NOT NULL DEFAULT '{}',
        custom_fields jsonb,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    // Migrate data from goats to animals
    await sql`
      INSERT INTO animals (
        id, name, animal_type, type, birth_date, birth_type,
        price, is_for_sale, registered, horn_status, dam, sire,
        bio, status, photos, created_at, updated_at
      )
      SELECT 
        id, name, 'Goat' as animal_type, type, birth_date, birth_type,
        price, is_for_sale, registered, horn_status, dam, sire,
        bio, status, photos, created_at, updated_at
      FROM goats
      ON CONFLICT (id) DO NOTHING
    `;

    // Create animal_health_records table
    await sql`
      CREATE TABLE IF NOT EXISTS animal_health_records (
        id bigserial PRIMARY KEY,
        animal_id bigint NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
        record_date date NOT NULL,
        record_type text NOT NULL,
        title text NOT NULL,
        description text,
        veterinarian text,
        medications text[] DEFAULT '{}',
        dosages jsonb,
        cost numeric(10, 2),
        next_due_date date,
        attachments text[] DEFAULT '{}',
        notes text,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    console.log('Migration completed successfully!');
    console.log('You can now drop the goats table if you want, or keep it for reference.');

    await sql.end();
  } catch (error) {
    console.error('Migration error:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateGoatsToAnimals();

