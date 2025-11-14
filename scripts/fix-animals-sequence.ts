import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ No database connection string found');
  process.exit(1);
}

async function fixAnimalsSequence() {
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    console.log('🔧 Fixing animals table sequence...\n');

    // Get the current max ID
    const maxIdResult = await sql`
      SELECT COALESCE(MAX(id), 0) as max_id FROM animals
    `;
    const maxId = Number(maxIdResult[0].max_id);
    console.log(`📊 Current max ID in animals table: ${maxId}`);

    // Get the current sequence value
    const currentSeqResult = await sql`
      SELECT last_value FROM animals_id_seq
    `;
    const currentSeq = Number(currentSeqResult[0].last_value);
    console.log(`📊 Current sequence value: ${currentSeq}`);

    if (currentSeq <= maxId) {
      // Reset the sequence to maxId + 1 (or 1 if table is empty)
      const newSeqValue = maxId + 1;
      await sql`
        SELECT setval('animals_id_seq', ${newSeqValue}, true)
      `;
      console.log(`✅ Sequence reset to: ${newSeqValue}`);
      console.log(`\n✨ Next insert will use ID: ${newSeqValue}`);
    } else {
      console.log(`✅ Sequence is already ahead of max ID (${currentSeq} > ${maxId})`);
    }

    await sql.end();
    console.log('\n🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

fixAnimalsSequence();

