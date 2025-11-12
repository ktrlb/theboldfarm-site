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
    console.log('Starting migration from goats to animals...');

    // Check if animals table exists and has data
    const animalsCount = await sql`
      SELECT COUNT(*) as count FROM animals
    `;
    console.log(`Animals table has ${animalsCount[0].count} records`);

    // Check if goats table exists and has data
    const goatsCount = await sql`
      SELECT COUNT(*) as count FROM goats
    `;
    console.log(`Goats table has ${goatsCount[0].count} records`);

    // Migrate data from goats to animals if goats table exists and animals is empty
    if (parseInt(goatsCount[0].count as string) > 0 && parseInt(animalsCount[0].count as string) === 0) {
      console.log('Migrating data from goats to animals...');
      
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

      console.log('Migration completed successfully!');
    } else if (parseInt(animalsCount[0].count as string) > 0) {
      console.log('Animals table already has data. Skipping migration.');
    } else {
      console.log('No goats data to migrate.');
    }

    await sql.end();
  } catch (error) {
    console.error('Migration error:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateGoatsToAnimals();

