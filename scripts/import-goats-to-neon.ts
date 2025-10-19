import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.NEON_POSTGRES_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ Neon connection string not found');
  process.exit(1);
}

const sql = postgres(connectionString);

const goatsData = [
  {
    "name": "Lucky",
    "type": "Pet Only Doe",
    "birth_date": "2025-09-21",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": null,
    "sire": null,
    "bio": "Lucky is a sweet girl! ",
    "status": "Available",
    "created_at": "2025-09-21 17:50:33.589+00",
    "updated_at": "2025-10-05 14:29:24.232+00"
  },
  {
    "name": "Lightning",
    "type": "Wether",
    "birth_date": "2025-09-21",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": null,
    "sire": null,
    "bio": "This guy needs to be eaten or something. ",
    "status": "Available",
    "created_at": "2025-09-21 18:11:59.862+00",
    "updated_at": "2025-10-06 00:13:39.559+00"
  },
  {
    "name": "Nut",
    "type": "Breeding Buck",
    "birth_date": "2025-09-21",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Horned",
    "dam": "Jillian",
    "sire": "Peanut Butter Nut",
    "bio": "Nut is an interesting guy! ",
    "status": "Available",
    "created_at": "2025-09-21 18:08:36.827+00",
    "updated_at": "2025-10-06 00:13:58.421+00"
  },
  {
    "name": "Peanut Butternut",
    "type": "Breeding Buck",
    "birth_date": "2022-08-19",
    "birth_type": "exact",
    "price": "150.00",
    "is_for_sale": true,
    "registered": true,
    "horn_status": "Dehorned",
    "dam": "Angel",
    "sire": "Maestro",
    "bio": "He's a really sweet boy!",
    "status": "Available",
    "created_at": "2025-08-19 23:49:46.861+00",
    "updated_at": "2025-08-20 03:12:07.014+00"
  },
  {
    "name": "Iredessa",
    "type": "Dairy Doe",
    "birth_date": "2021-01-01",
    "birth_type": "year",
    "price": "200.00",
    "is_for_sale": true,
    "registered": true,
    "horn_status": "Dehorned",
    "dam": "Angel",
    "sire": "LD",
    "bio": "Iredessa is a beautiful girl and a great mama. She has minimal milk stand experience, but took to it quite well as a first freshener.",
    "status": "Available",
    "created_at": "2025-09-14 14:30:59.806+00",
    "updated_at": "2025-09-14 14:30:58.79+00"
  },
  {
    "name": "Sparkle",
    "type": "Dairy Doe",
    "birth_date": "2022-01-01",
    "birth_type": "year",
    "price": "150.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": "Bubbles",
    "sire": "Cheddar Biscuit",
    "bio": "Sparkle is a real cutie and a great mom. ",
    "status": "Available",
    "created_at": "2025-09-14 14:33:53.497+00",
    "updated_at": "2025-09-14 14:33:52.446+00"
  },
  {
    "name": "Mirabel",
    "type": "Dairy Doe",
    "birth_date": "2025-09-21",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": null,
    "sire": null,
    "bio": "Mirabel was a quadruplet born by Jillian, and she's a darling girl who really takes after her mom's temperament. ",
    "status": "Available",
    "created_at": "2025-09-21 17:49:44.216+00",
    "updated_at": "2025-09-21 17:49:42.98+00"
  },
  {
    "name": "Kristoff",
    "type": "Buckling Kid",
    "birth_date": "2025-04-12",
    "birth_type": "exact",
    "price": "75.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Horned",
    "dam": "Glacier",
    "sire": "Unknown",
    "bio": "Kristoff is a cute and sweet guy. ",
    "status": "Available",
    "created_at": "2025-08-20 02:42:14.702+00",
    "updated_at": "2025-09-21 18:07:11.98+00"
  },
  {
    "name": "Ash the First",
    "type": "Buckling Kid",
    "birth_date": "2025-04-12",
    "birth_type": "exact",
    "price": "75.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Horned",
    "dam": "Misty",
    "sire": "Peanut Butternut",
    "bio": "Really cute goat. Love his mom. ",
    "status": "Available",
    "created_at": "2025-08-20 00:37:09.221+00",
    "updated_at": "2025-09-21 18:07:17.023+00"
  },
  {
    "name": "Red",
    "type": "Buckling Kid",
    "birth_date": "2025-06-06",
    "birth_type": "exact",
    "price": "75.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": "Mirabel",
    "sire": "Peanut Butternut",
    "bio": "He's super cute! A true red color, and very friendly. ",
    "status": "Available",
    "created_at": "2025-08-20 00:35:38.184+00",
    "updated_at": "2025-09-21 18:07:22.68+00"
  },
  {
    "name": "Glacier",
    "type": "Dairy Doe",
    "birth_date": "2025-08-17",
    "birth_type": "exact",
    "price": "100.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Horned",
    "dam": null,
    "sire": null,
    "bio": "Glacier is a really sweet girl, and was a great mom!",
    "status": "Available",
    "created_at": "2025-08-17 20:23:54.055+00",
    "updated_at": "2025-09-21 18:07:29.163+00"
  },
  {
    "name": "Sunrise",
    "type": "Doeling Kid",
    "birth_date": "2025-04-12",
    "birth_type": "exact",
    "price": "100.00",
    "is_for_sale": true,
    "registered": false,
    "horn_status": "Horned",
    "dam": "Sparkle",
    "sire": "Peanut Butternut",
    "bio": "Sunrise is the girls' favorite!",
    "status": "Available",
    "created_at": "2025-08-20 02:43:37.275+00",
    "updated_at": "2025-09-21 18:07:37.973+00"
  },
  {
    "name": "Jillian",
    "type": "Dairy Doe",
    "birth_date": "2025-09-20",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Horned",
    "dam": null,
    "sire": null,
    "bio": "Jillian is Karlie's favorite goat. A wonderful mama, she gets as wide as she is long before she kids!",
    "status": "Available",
    "created_at": "2025-09-20 21:02:20.241+00",
    "updated_at": "2025-09-21 18:07:47.465+00"
  },
  {
    "name": "Junie",
    "type": "Doeling Kid",
    "birth_date": "2025-09-21",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": null,
    "sire": null,
    "bio": "Junie is Jillian Junior, and we love her!",
    "status": "Available",
    "created_at": "2025-09-21 18:45:32.588+00",
    "updated_at": "2025-10-05 14:28:01.482+00"
  },
  {
    "name": "Moonie",
    "type": "Doeling Kid",
    "birth_date": "2025-10-05",
    "birth_type": "exact",
    "price": "0.00",
    "is_for_sale": false,
    "registered": false,
    "horn_status": "Dehorned",
    "dam": "Jillian",
    "sire": null,
    "bio": "One of Jillian's twins, this little gold and white girl is so cute!",
    "status": "Available",
    "created_at": "2025-10-05 14:28:59.629+00",
    "updated_at": "2025-10-05 14:28:56.796+00"
  }
];

async function importGoats() {
  try {
    console.log('🚀 Importing goats into Neon...\n');

    // Clear existing goats
    console.log('🧹 Clearing existing data...');
    await sql`DELETE FROM goats`;
    console.log('   ✅ Cleared\n');

    // Import each goat
    console.log('📥 Importing goats...');
    for (const goat of goatsData) {
      await sql`
        INSERT INTO goats (
          name, type, birth_date, birth_type, price, is_for_sale,
          registered, horn_status, dam, sire, bio, status, photos,
          created_at, updated_at
        ) VALUES (
          ${goat.name}, 
          ${goat.type}, 
          ${goat.birth_date}, 
          ${goat.birth_type},
          ${goat.price}, 
          ${goat.is_for_sale}, 
          ${goat.registered}, 
          ${goat.horn_status},
          ${goat.dam}, 
          ${goat.sire}, 
          ${goat.bio}, 
          ${goat.status},
          ARRAY[]::text[],
          ${goat.created_at}, 
          ${goat.updated_at}
        )
      `;
      console.log(`   ✓ ${goat.name}`);
    }

    console.log(`\n✨ Successfully imported ${goatsData.length} goats!`);

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

importGoats()
  .then(() => {
    console.log('\n🎉 Import complete! Your goats are now in Neon.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Error:', err);
    process.exit(1);
  });

