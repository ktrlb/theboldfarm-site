import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('No database connection string found');
  process.exit(1);
}

async function cleanupGoatsTable() {
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    console.log('Checking if goats table exists...');

    const goatsExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'goats'
      )
    `;

    if (goatsExists[0].exists) {
      // Verify data was migrated
      const animalsCount = await sql`SELECT COUNT(*) as count FROM animals`;
      const goatsCount = await sql`SELECT COUNT(*) as count FROM goats`;
      
      console.log(`Animals table has ${animalsCount[0].count} records`);
      console.log(`Goats table has ${goatsCount[0].count} records`);

      if (parseInt(animalsCount[0].count as string) >= parseInt(goatsCount[0].count as string)) {
        console.log('✓ Data migration verified. Dropping goats table...');
        await sql`DROP TABLE IF EXISTS goats CASCADE`;
        console.log('✓ Goats table dropped successfully');
      } else {
        console.log('⚠️  Warning: Animals table has fewer records than goats table.');
        console.log('   Not dropping goats table to prevent data loss.');
        console.log('   Please verify the migration manually.');
      }
    } else {
      console.log('✓ Goats table does not exist (already cleaned up)');
    }

    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

cleanupGoatsTable();

