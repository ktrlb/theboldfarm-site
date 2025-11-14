import type { Metadata } from "next";
import { getImageForSection } from "@/lib/image-placements";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/image-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  // Get the beef hero image for Open Graph
  let ogImage = await getImageForSection('beef-hero');
  if (!ogImage) {
    // Use fallback image if no hero image is set
    ogImage = DEFAULT_FALLBACK_IMAGE;
  }

  // Ensure the image URL is absolute for Open Graph
  // If it's already absolute (starts with http), use it as-is
  // If it's relative, we need to make it absolute
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'https://theboldfarm.com';
  
  const ogImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${baseUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  const title = "Farm-Fresh Beef, Raised with Care | The Bold Farm";
  const description = "Experience the difference of knowing exactly where your beef comes from. Our cattle are raised on pasture with care and attention, resulting in high-quality beef that you can feel good about serving your family. Reserve your quarter or half cow today.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/beef`,
      siteName: "The Bold Farm",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "The Bold Farm - Farm-Fresh Beef",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function BeefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

