# Supabase Setup Guide for The Bold Farm Website

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Copy your **service_role key** (keep this secret!)

## Step 3: Create Environment File

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

### Goats Table
```sql
CREATE TABLE goats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  birth_date DATE,
  birth_type VARCHAR(20) CHECK (birth_type IN ('exact', 'year')),
  price DECIMAL(10,2) NOT NULL,
  registered BOOLEAN DEFAULT false,
  horn_status VARCHAR(50) NOT NULL,
  dam VARCHAR(100),
  sire VARCHAR(100),
  bio TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Available',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE goats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON goats
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON goats
  FOR ALL USING (auth.role() = 'authenticated');
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

## Step 5: Insert Sample Data

You can insert some sample goats to test with:

```sql
INSERT INTO goats (name, type, birth_date, birth_type, price, registered, horn_status, dam, sire, bio, status) VALUES
('Bella', 'Dairy Doe', '2022-03-15', 'exact', 800.00, true, 'Horned', 'Luna', 'Thunder', 'Bella is a beautiful registered Nigerian Dwarf doe with excellent milk production.', 'Available'),
('Shadow', 'Breeding Buck', '2021-01-01', 'year', 600.00, false, 'Dehorned', 'Unknown', 'Unknown', 'Shadow is a handsome unregistered buck with great genetics.', 'Available'),
('Peanut', 'Kid', '2024-09-15', 'exact', 400.00, false, 'Horned', 'Bella', 'Shadow', 'Peanut is an adorable kid with a playful personality.', 'Reserved');
```

## Step 6: Test Your Setup

1. Restart your development server
2. Visit `/admin` to test adding/editing goats
3. Visit `/animals` and `/goats` to see the data
4. Check the browser console for any errors

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check your environment variables
2. **"Table doesn't exist"**: Make sure you ran the SQL commands
3. **"RLS policy violation"**: Check your Row Level Security policies
4. **CORS errors**: Supabase handles CORS automatically

### Security Notes:

- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose
- Row Level Security (RLS) protects your data
- Consider adding authentication for admin access later

## Next Steps

Once Supabase is working:
1. Add image upload functionality for goat photos
2. Implement user authentication for admin access
3. Add real-time subscriptions for live updates
4. Set up automated backups

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the browser console for detailed error messages
