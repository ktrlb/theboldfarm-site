import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL || process.env.NEON_POSTGRES_DATABASE_URL || '';

if (!connectionString) {
  console.error('❌ No Postgres connection string found');
  process.exit(1);
}

async function checkDatabase() {
  const sql = postgres(connectionString!);
  
  try {
    console.log('🔌 Connecting to Neon Postgres...\n');
    
    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📊 Existing tables:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
    // Check goats count
    try {
      const goatsCount = await sql`SELECT COUNT(*) as count FROM goats`;
      console.log(`\n🐐 Goats in database: ${goatsCount[0].count}`);
    } catch (e) {
      console.log('\n🐐 Goats table: exists but empty or error');
    }
    
    // Check products count
    try {
      const productsCount = await sql`SELECT COUNT(*) as count FROM products`;
      console.log(`🛍️  Products in database: ${productsCount[0].count}`);
    } catch (e) {
      console.log('🛍️  Products table: exists but empty or error');
    }
    
    // Check pastures count
    try {
      const pasturesCount = await sql`SELECT COUNT(*) as count FROM pastures`;
      console.log(`🌾 Pastures in database: ${pasturesCount[0].count}`);
    } catch (e) {
      console.log('🌾 Pastures table: not created yet');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

checkDatabase();


