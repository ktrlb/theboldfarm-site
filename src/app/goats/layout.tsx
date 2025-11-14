import type { Metadata } from "next";
import { getImageForSection } from "@/lib/image-placements";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/image-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  // Get the goats hero image for Open Graph
  let ogImage = await getImageForSection('goats-hero');
  if (!ogImage) {
    ogImage = DEFAULT_FALLBACK_IMAGE;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'https://theboldfarm.com';
  
  const ogImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${baseUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage.replace(/ /g, '%20')}`;

  const title = "Nigerian Dwarf Goats for Sale | The Bold Farm";
  const description = "Quality Nigerian Dwarf goats available for your homestead. We prioritize our goats' health & socialization, and will be available for questions before and after you bring your new goats home.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/goats`,
      siteName: "The Bold Farm",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "The Bold Farm - Nigerian Dwarf Goats",
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

export default function GoatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

