import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Neon connection
const neonConnectionString = process.env.POSTGRES_URL || process.env.NEON_POSTGRES_POSTGRES_URL;

if (!neonConnectionString) {
  console.error('❌ Neon connection string not found');
  process.exit(1);
}

const neon = postgres(neonConnectionString);

async function migrateData() {
  try {
    console.log('🚀 Starting data migration from Supabase to Neon...\n');

    // 1. Export goats from Supabase
    console.log('📤 Exporting goats from Supabase...');
    const { data: goats, error: goatsError } = await supabase
      .from('goats')
      .select('*');

    if (goatsError) {
      console.error('❌ Error fetching goats from Supabase:', goatsError);
      throw goatsError;
    }

    console.log(`   ✅ Found ${goats?.length || 0} goats`);

    // 2. Export products from Supabase
    console.log('📤 Exporting products from Supabase...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('❌ Error fetching products from Supabase:', productsError);
      throw productsError;
    }

    console.log(`   ✅ Found ${products?.length || 0} products\n`);

    // 3. Clear existing data in Neon (if any)
    console.log('🧹 Clearing existing data in Neon...');
    await neon`DELETE FROM goats`;
    await neon`DELETE FROM products`;
    console.log('   ✅ Tables cleared\n');

    // 4. Import goats into Neon
    if (goats && goats.length > 0) {
      console.log('📥 Importing goats into Neon...');
      for (const goat of goats) {
        await neon`
          INSERT INTO goats (
            name, type, birth_date, birth_type, price, is_for_sale, 
            registered, horn_status, dam, sire, bio, status, photos, 
            created_at, updated_at
          ) VALUES (
            ${goat.name}, ${goat.type}, ${goat.birth_date}, ${goat.birth_type},
            ${goat.price}, ${goat.is_for_sale}, ${goat.registered}, ${goat.horn_status},
            ${goat.dam}, ${goat.sire}, ${goat.bio}, ${goat.status}, 
            ${goat.photos}, ${goat.created_at}, ${goat.updated_at}
          )
        `;
      }
      console.log(`   ✅ Imported ${goats.length} goats`);
    }

    // 5. Import products into Neon
    if (products && products.length > 0) {
      console.log('📥 Importing products into Neon...');
      for (const product of products) {
        await neon`
          INSERT INTO products (
            name, category, price, description, in_stock, featured, created_at
          ) VALUES (
            ${product.name}, ${product.category}, ${product.price},
            ${product.description}, ${product.in_stock}, ${product.featured},
            ${product.created_at}
          )
        `;
      }
      console.log(`   ✅ Imported ${products.length} products`);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Goats migrated: ${goats?.length || 0}`);
    console.log(`   - Products migrated: ${products?.length || 0}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await neon.end();
  }
}

migrateData()
  .then(() => {
    console.log('\n🎉 You can now switch your app to use Neon!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Migration error:', err);
    process.exit(1);
  });


