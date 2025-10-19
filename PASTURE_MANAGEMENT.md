# Pasture Management System

## Overview
A comprehensive pasture tracking and management system for The Bold Farm, designed to help manage grazing rotations, monitor pasture health, and optimize land use for your Nigerian Dwarf goats and other livestock.

## Features Implemented

### ✅ **Phase 1: Core System (Complete)**

#### Database Schema
- **`pastures` table** - Store pasture information with custom shapes
- **`grazing_rotations` table** - Track animal movements and grazing periods
- **`pasture_observations` table** - Record detailed pasture assessments
- **`pasture_rest_periods` table** - Monitor recovery and rest periods
- **`property_map` table** - Overall property layout and boundaries

#### Data Management
- Full CRUD operations for all pasture data
- Real-time data synchronization with Supabase
- Enriched pasture data with current rotations and rest periods
- Automatic calculation of rest period days

#### Dashboard
- **Overview Tab**: Visual cards showing all pastures with status indicators
- **Rotations Tab**: Track current and historical grazing rotations
- **Observations Tab**: View pasture health observations and assessments
- **Map View Tab**: Placeholder for future interactive map

#### Key Metrics
- Total pastures (active/inactive)
- Currently grazing count
- Pastures resting count
- Pastures needing attention (quality < 3 stars)

## How to Use

### 1. Setup Database
Run the SQL script in your Supabase SQL Editor:
```bash
pasture_management_schema.sql
```

This will create all necessary tables, triggers, policies, and sample data.

### 2. Access the Dashboard
Navigate to: `/admin/pastures`

*Note: This route should be protected by your admin authentication system*

### 3. Managing Pastures

#### Add a New Pasture
1. Click "Add Pasture" button
2. Enter pasture details:
   - Name, description, area size
   - Quality rating (1-5 stars)
   - Forage type, fencing details
   - Water source, shade availability
3. Optionally add shape data (coordinates or SVG path)

#### Start a Grazing Rotation
1. Select an available pasture
2. Click "Start Grazing"
3. Enter:
   - Animal type and count
   - Grazing pressure (Light/Moderate/Heavy)
   - Starting quality rating
   - Optional notes

#### Add an Observation
1. Click "Add Observation"
2. Record:
   - Quality rating
   - Forage height
   - Moisture level
   - Weed pressure
   - Any action items needed
   - Photos and notes

#### Track Rest Periods
1. When moving animals out, end the rotation
2. System automatically tracks rest period
3. Record recovery actions taken
4. End rest period when ready to graze again

## Data Structure

### Pasture Fields
- **Basic Info**: name, description, area_size, area_unit
- **Quality**: quality_rating (1-5 stars), forage_type
- **Infrastructure**: water_source, shade_available, fencing_type, fencing_condition
- **Shape**: shape_data (JSON with polygon or SVG)
- **Status**: is_active, current_rotation, rest_period

### Grazing Rotation Fields
- **Timing**: start_date, end_date, is_current
- **Animals**: animal_type, animal_count, animal_ids
- **Impact**: grazing_pressure, quality_start, quality_end
- **Notes**: general observations

### Observation Fields
- **Assessment**: quality_rating, forage_height, moisture_level, weed_pressure
- **Metrics**: bare_spots_percentage
- **Actions**: needs_reseeding, needs_mowing, needs_fertilizing
- **Documentation**: photos, notes, observed_by

### Rest Period Fields
- **Timing**: start_date, planned_end_date, actual_end_date
- **Purpose**: reason (rotation rest, recovery, reseeding, etc.)
- **Actions**: recovery_actions (array of actions taken)
- **Status**: is_active

## Irregular Shape Support

The system supports non-square/irregular pasture shapes:

### Method 1: Polygon Coordinates
Store as array of [x, y] coordinates:
```json
{
  "type": "polygon",
  "coordinates": [[0, 0], [100, 0], [120, 80], [40, 100], [0, 60]]
}
```

### Method 2: SVG Path
Import or create SVG paths:
```json
{
  "type": "svg",
  "svg_path": "M 0,0 L 100,0 L 120,80 L 40,100 L 0,60 Z"
}
```

### Method 3: Satellite Image Overlay (Future)
- Upload satellite/aerial imagery
- Draw boundaries directly on image
- System converts to coordinates automatically

## Future Enhancements

### 🚧 **Phase 2: Visual Map (Planned)**
- Interactive property map with drag-and-drop
- Draw irregular pasture boundaries directly
- Visual status indicators (color-coded by status)
- Click pastures to view/edit details
- Import satellite imagery as background

### 🚧 **Phase 3: Advanced Features (Planned)**
- Automatic rotation scheduling
- Pasture recovery recommendations
- Grazing days calculator
- Stock density analysis
- Historical trend charts
- Export reports to PDF
- Mobile-responsive map interface

### 🚧 **Phase 4: Integration (Planned)**
- Link specific goats to rotations
- Weather integration
- Growth rate tracking
- Fertilization schedule
- Soil testing records

## Technical Details

### Context Provider
The `PastureProvider` wraps the admin section and provides:
- Real-time data synchronization
- CRUD operations
- Utility functions
- Loading and error states

### File Structure
```
src/
├── lib/
│   ├── pasture-types.ts       # TypeScript interfaces
│   └── pasture-context.tsx    # Data management context
├── app/
│   └── admin/
│       └── pastures/
│           └── page.tsx        # Main dashboard
└── components/
    └── ui/
        └── tabs.tsx            # Tab component
```

### Database Tables
- `pastures` - Main pasture records
- `grazing_rotations` - Movement tracking
- `pasture_observations` - Health assessments
- `pasture_rest_periods` - Recovery tracking
- `property_map` - Property boundaries

## Best Practices

### Rotation Management
1. Record quality at start of grazing
2. Note animal count and pressure level
3. End rotation when moving animals
4. Record end quality for comparison

### Observation Frequency
- **Active grazing**: Weekly observations
- **Resting**: Bi-weekly or monthly
- **Critical pastures**: More frequent checks

### Rest Period Guidelines
- **Light grazing**: 30-45 days rest
- **Moderate grazing**: 45-60 days rest
- **Heavy grazing**: 60+ days rest
- **Recovery**: 90+ days with interventions

### Quality Ratings
- ⭐ Poor - Bare, overgrazed, needs immediate attention
- ⭐⭐ Fair - Thin, recovering, needs management
- ⭐⭐⭐ Good - Adequate forage, routine management
- ⭐⭐⭐⭐ Very Good - Healthy, productive
- ⭐⭐⭐⭐⭐ Excellent - Optimal condition, diverse forage

## Troubleshooting

### Data Not Loading
1. Check Supabase connection in `.env.local`
2. Verify SQL schema was run successfully
3. Check browser console for errors

### Can't Add Pastures
1. Ensure you're logged in to admin
2. Check Row Level Security policies
3. Verify authentication token

### Shape Data Not Displaying
1. Ensure JSON is properly formatted
2. Check coordinate values are reasonable
3. Validate SVG path syntax

## Support

For questions or issues with the pasture management system, check:
- Database connection settings
- Supabase table structure
- Browser console for errors
- Network tab for API calls

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Core features complete, visual map in development



