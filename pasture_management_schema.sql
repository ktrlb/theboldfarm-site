-- Pasture Management System Schema for The Bold Farm
-- Run this in your Supabase SQL Editor

-- Create pastures table
CREATE TABLE IF NOT EXISTS pastures (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    area_size DECIMAL(10,2), -- in acres or square feet
    area_unit TEXT DEFAULT 'acres' CHECK (area_unit IN ('acres', 'sq_ft', 'sq_meters')),
    shape_data JSONB, -- Store polygon coordinates or SVG path data
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5), -- 1-5 stars
    forage_type TEXT, -- e.g., 'Mixed grass', 'Clover', 'Browse', etc.
    water_source BOOLEAN DEFAULT false,
    shade_available BOOLEAN DEFAULT false,
    fencing_type TEXT, -- e.g., 'Electric', 'Woven wire', 'T-post', etc.
    fencing_condition TEXT CHECK (fencing_condition IN ('Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair')),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grazing rotations table
CREATE TABLE IF NOT EXISTS grazing_rotations (
    id BIGSERIAL PRIMARY KEY,
    pasture_id BIGINT REFERENCES pastures(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    animal_type TEXT NOT NULL, -- e.g., 'Goats', 'Cows', 'Chickens', 'Mixed'
    animal_count INTEGER,
    animal_ids INTEGER[], -- Array of goat IDs if tracking specific animals
    grazing_pressure TEXT CHECK (grazing_pressure IN ('Light', 'Moderate', 'Heavy', 'Intensive')),
    pasture_quality_start INTEGER CHECK (pasture_quality_start >= 1 AND pasture_quality_start <= 5),
    pasture_quality_end INTEGER CHECK (pasture_quality_end >= 1 AND pasture_quality_end <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pasture observations table (for tracking over time)
CREATE TABLE IF NOT EXISTS pasture_observations (
    id BIGSERIAL PRIMARY KEY,
    pasture_id BIGINT REFERENCES pastures(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    forage_height DECIMAL(5,2), -- in inches
    moisture_level TEXT CHECK (moisture_level IN ('Very Dry', 'Dry', 'Moderate', 'Moist', 'Wet', 'Very Wet')),
    weed_pressure TEXT CHECK (weed_pressure IN ('None', 'Low', 'Moderate', 'High', 'Severe')),
    bare_spots_percentage DECIMAL(5,2), -- percentage of bare ground
    needs_reseeding BOOLEAN DEFAULT false,
    needs_mowing BOOLEAN DEFAULT false,
    needs_fertilizing BOOLEAN DEFAULT false,
    photos TEXT[], -- URLs to observation photos
    notes TEXT,
    observed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pasture rest periods table
CREATE TABLE IF NOT EXISTS pasture_rest_periods (
    id BIGSERIAL PRIMARY KEY,
    pasture_id BIGINT REFERENCES pastures(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    planned_end_date DATE,
    actual_end_date DATE,
    reason TEXT, -- e.g., 'Rotation rest', 'Overgrazing recovery', 'Reseeding', 'Winter rest'
    recovery_actions TEXT[], -- e.g., ['Mowed', 'Fertilized', 'Reseeded', 'Harrowed']
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property map table (overall property layout)
CREATE TABLE IF NOT EXISTS property_map (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'The Bold Farm',
    total_area DECIMAL(10,2),
    area_unit TEXT DEFAULT 'acres',
    boundary_data JSONB, -- Overall property boundary
    map_image_url TEXT, -- Optional satellite/aerial image
    map_svg TEXT, -- Custom SVG map if created
    map_scale DECIMAL(10,2), -- Scale for measurements
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_pastures_updated_at ON pastures;
CREATE TRIGGER update_pastures_updated_at
    BEFORE UPDATE ON pastures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_grazing_rotations_updated_at ON grazing_rotations;
CREATE TRIGGER update_grazing_rotations_updated_at
    BEFORE UPDATE ON grazing_rotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pasture_rest_periods_updated_at ON pasture_rest_periods;
CREATE TRIGGER update_pasture_rest_periods_updated_at
    BEFORE UPDATE ON pasture_rest_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE pastures ENABLE ROW LEVEL SECURITY;
ALTER TABLE grazing_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pasture_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pasture_rest_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_map ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pastures" ON pastures
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to grazing_rotations" ON grazing_rotations
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to pasture_observations" ON pasture_observations
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to pasture_rest_periods" ON pasture_rest_periods
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to property_map" ON property_map
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Allow authenticated users to manage pastures" ON pastures
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage grazing_rotations" ON grazing_rotations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage pasture_observations" ON pasture_observations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage pasture_rest_periods" ON pasture_rest_periods
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage property_map" ON property_map
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pastures_is_active ON pastures(is_active);
CREATE INDEX IF NOT EXISTS idx_grazing_rotations_pasture_id ON grazing_rotations(pasture_id);
CREATE INDEX IF NOT EXISTS idx_grazing_rotations_is_current ON grazing_rotations(is_current);
CREATE INDEX IF NOT EXISTS idx_grazing_rotations_dates ON grazing_rotations(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_pasture_observations_pasture_id ON pasture_observations(pasture_id);
CREATE INDEX IF NOT EXISTS idx_pasture_observations_date ON pasture_observations(observation_date);
CREATE INDEX IF NOT EXISTS idx_pasture_rest_periods_pasture_id ON pasture_rest_periods(pasture_id);
CREATE INDEX IF NOT EXISTS idx_pasture_rest_periods_is_active ON pasture_rest_periods(is_active);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON pastures TO anon, authenticated;
GRANT ALL ON grazing_rotations TO anon, authenticated;
GRANT ALL ON pasture_observations TO anon, authenticated;
GRANT ALL ON pasture_rest_periods TO anon, authenticated;
GRANT ALL ON property_map TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample data
INSERT INTO property_map (name, total_area, area_unit, notes) VALUES
('The Bold Farm', 10.5, 'acres', 'Main property with mixed pasture and wooded areas');

INSERT INTO pastures (name, description, area_size, area_unit, quality_rating, forage_type, water_source, shade_available, fencing_type, fencing_condition, notes) VALUES
('Front Paddock', 'Main goat paddock near barn', 1.5, 'acres', 4, 'Mixed grass and clover', true, true, 'Electric', 'Good', 'Close to barn, good for kids'),
('Back Pasture', 'Larger grazing area with browse', 3.0, 'acres', 3, 'Mixed grass with browse', false, true, 'Woven wire', 'Good', 'More wild area, good for rotation'),
('Side Lot', 'Sacrifice area for winter', 0.75, 'acres', 2, 'Mixed grass', true, false, 'T-post', 'Fair', 'Gets muddy in winter, needs improvement');

-- Verify the setup
SELECT 'Pastures table created successfully' as status, COUNT(*) as total_pastures FROM pastures;
SELECT 'Grazing rotations table created successfully' as status, COUNT(*) as total_rotations FROM grazing_rotations;
SELECT 'Pasture observations table created successfully' as status, COUNT(*) as total_observations FROM pasture_observations;
SELECT 'Pasture rest periods table created successfully' as status, COUNT(*) as total_rest_periods FROM pasture_rest_periods;
SELECT 'Property map created successfully' as status, COUNT(*) as total_properties FROM property_map;



