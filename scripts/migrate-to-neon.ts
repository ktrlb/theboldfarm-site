import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL || process.env.NEON_POSTGRES_POSTGRES_URL;

if (!connectionString) {
  console.error('❌ No Postgres connection string found in environment variables');
  process.exit(1);
}

async function migrate() {
  const sql = postgres(connectionString);
  
  try {
    console.log('🔌 Connecting to Neon Postgres...');
    
    // Read and execute the migration file
    const migrationPath = path.join(process.cwd(), 'drizzle', '0000_sparkling_red_skull.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing migration...');
    
    // Split by statement breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      console.log(`   Executing: ${statement.substring(0, 50)}...`);
      await sql.unsafe(statement);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - goats');
    console.log('   - products');
    console.log('   - pastures');
    console.log('   - grazing_rotations');
    console.log('   - pasture_observations');
    console.log('   - pasture_rest_periods');
    console.log('   - property_map');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate()
  .then(() => {
    console.log('\n🎉 Database setup complete! You can now export data from Supabase.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Migration error:', err);
    process.exit(1);
  });


