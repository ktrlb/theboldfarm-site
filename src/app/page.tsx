import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Egg, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getRandomImageFromAlbum, getImagesFromAlbums } from "@/lib/images";
import { getImageForSection } from "@/lib/image-placements";
import { FarmLogo } from "@/components/farm-logo";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/image-fallbacks";

async function HomeHero() {
  // First try to get assigned image, then fall back to album images, then fallback image
  let heroImage: string | null = await getImageForSection('home-hero');
  if (!heroImage) {
    const heroImages = await getImagesFromAlbums(['farm', 'hero', 'home', 'general', 'site', 'images']);
    heroImage = heroImages.length > 0 ? heroImages[0] : DEFAULT_FALLBACK_IMAGE;
  }
  const hasImage = !!heroImage;

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {heroImage ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="The Bold Farm"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/40"></div>
        </>
      ) : (
        <div className="absolute inset-0 farm-gradient opacity-90"></div>
      )}
      <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 ${hasImage ? 'text-white' : 'text-gray-900'}`}>
        <div className="mb-8">
          <div className="flex justify-center">
            <FarmLogo 
              variant={hasImage ? "dark" : "light"} 
              full={true} 
              size="xl" 
              className="drop-shadow-lg h-24 sm:h-32 md:h-40 w-auto max-w-[90vw]"
              priority 
            />
          </div>
        </div>

        <p className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-lg ${hasImage ? 'text-white' : 'text-deep-earth-brown'}`}>
          Quality Nigerian Dwarf dairy goats, family cows, and homestead products. 
          Building a sustainable future, one animal at a time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-growth hover:opacity-90 text-white shadow-lg">
            <Link href="/goats">View Available Goats</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className={hasImage ? "bg-white/90 hover:bg-white text-bold-black border-white" : "border-honey-gold text-honey-gold hover:bg-cream"}
          >
            <Link href="/about">Learn About Our Farm</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

async function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  albumName,
  fallbackIcon,
  sectionId
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  albumName?: string;
  fallbackIcon?: string;
  sectionId?: string;
}) {
  // First try to get assigned image for this section
  let image: string | null = null;
  if (sectionId) {
    image = await getImageForSection(sectionId);
  }
  
  // If no assigned image, try to get image from specific album
  if (!image && albumName) {
    image = await getRandomImageFromAlbum(albumName);
  }
  
  // Use fallback image if no image found
  if (!image) {
    image = DEFAULT_FALLBACK_IMAGE;
  }
  
  return (
    <Card className="text-center hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-48 bg-gradient-earth-to-light relative overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {fallbackIcon ? (
              <div className="text-6xl">{fallbackIcon}</div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <HomeHero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From quality livestock to homestead products, we&apos;re committed to sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Nigerian Dwarf Goats"
              description="Quality dairy goats known for their sweet milk and friendly personalities."
              icon={Heart}
              albumName="goats"
              fallbackIcon="🐐"
              sectionId="home-feature-goats"
            />
            <FeatureCard
              title="Family Cows"
              description="Beef and dairy cows perfect for family farms and homesteads."
              icon={Star}
              albumName="cows"
              fallbackIcon="🐄"
              sectionId="home-feature-cows"
            />
            <FeatureCard
              title="Fresh Eggs"
              description="Farm-fresh eggs from our happy, free-range chickens."
              icon={Egg}
              albumName="chickens"
              fallbackIcon="🥚"
              sectionId="home-feature-chickens"
            />
            <FeatureCard
              title="Homestead Products"
              description="Handmade soaps, t-shirts, and other farm-inspired goods."
              icon={Leaf}
              albumName="products"
              fallbackIcon="🧴"
              sectionId="home-feature-products"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}

async function CTASection() {
  // First try to get assigned image, then fall back to album images, then fallback image
  let ctaImage: string | null = await getImageForSection('home-cta');
  if (!ctaImage) {
    const ctaImages = await getImagesFromAlbums(['farm', 'animals', 'general', 'site']);
    ctaImage = ctaImages.length > 0 ? ctaImages[Math.floor(Math.random() * ctaImages.length)] : DEFAULT_FALLBACK_IMAGE;
  }
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {ctaImage ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={ctaImage}
              alt="The Bold Farm"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white drop-shadow-lg">
          Ready to Start Your Homestead Journey?
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-100 drop-shadow-md leading-relaxed">
          Whether you&apos;re looking for quality livestock or want to learn more about sustainable farming, 
          we&apos;re here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-golden-hour hover:opacity-90 text-bold-black text-lg px-8 py-6 shadow-lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 text-lg px-8 py-6 backdrop-blur-sm"
          >
            <Link href="/animals">Meet Our Animals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
