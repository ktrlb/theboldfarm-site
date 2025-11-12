import { getDbInstance } from '@/lib/db/client';
import { imagePlacements } from '@/lib/db/schema';
import { PAGE_SECTIONS } from '@/lib/page-sections';
import { eq, desc, inArray } from 'drizzle-orm';

// Re-export PAGE_SECTIONS from the separate file for server-side use
export { PAGE_SECTIONS, type PageSection } from './page-sections';

/**
 * Get the assigned image for a page section
 * Returns the highest priority image, or null if none assigned
 */
export async function getImageForSection(pageSection: string): Promise<string | null> {
  try {
    const db = getDbInstance();
    if (!db) {
      return null;
    }

    const placements = await db
      .select()
      .from(imagePlacements)
      .where(eq(imagePlacements.page_section, pageSection))
      .orderBy(desc(imagePlacements.priority))
      .limit(1);

    return placements.length > 0 ? placements[0].image_url : null;
  } catch (error) {
    console.error(`Error fetching image for section ${pageSection}:`, error);
    return null;
  }
}

/**
 * Get all placements for a specific page
 */
export async function getPlacementsForPage(page: string): Promise<Array<{ section: string; image_url: string; description: string | null }>> {
  try {
    const db = getDbInstance();
    if (!db) {
      return [];
    }

    const sections = PAGE_SECTIONS.filter(s => s.page === page);
    const sectionIds = sections.map(s => s.id);

    if (sectionIds.length === 0) {
      return [];
    }

    const allPlacements = await db
      .select()
      .from(imagePlacements)
      .where(inArray(imagePlacements.page_section, sectionIds))
      .orderBy(desc(imagePlacements.priority));

    // Group by section and take the highest priority for each
    const placementMap = new Map<string, { section: string; image_url: string; description: string | null }>();
    for (const placement of allPlacements) {
      if (!placementMap.has(placement.page_section)) {
        placementMap.set(placement.page_section, {
          section: placement.page_section,
          image_url: placement.image_url,
          description: placement.description,
        });
      }
    }

    return Array.from(placementMap.values());
  } catch (error) {
    console.error(`Error fetching placements for page ${page}:`, error);
    return [];
  }
}

