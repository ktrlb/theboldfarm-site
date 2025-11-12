import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Leaf, Users, Target } from "lucide-react";
import Image from "next/image";
import { getImagesFromAlbums } from "@/lib/images";
import { getImageForSection } from "@/lib/image-placements";
import { FarmLogo } from "@/components/farm-logo";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/image-fallbacks";

async function AboutHero() {
  // First try to get assigned image, then fall back to album images, then fallback image
  let heroImage: string | null = await getImageForSection('about-hero');
  if (!heroImage) {
    const heroImages = await getImagesFromAlbums(['farm', 'about', 'general', 'site']);
    heroImage = heroImages.length > 0 ? heroImages[0] : DEFAULT_FALLBACK_IMAGE;
  }

  return (
    <section className="relative py-20 overflow-hidden">
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
          <div className="absolute inset-0 bg-black/50"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-cream"></div>
      )}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${heroImage ? 'text-white' : 'text-gray-900'}`}>
        <div className="mb-8">
          <div className="flex justify-center">
            <FarmLogo 
              variant={heroImage ? "dark" : "light"} 
              full={true} 
              size="lg" 
              className="drop-shadow-lg"
              priority 
            />
          </div>
        </div>

        <p className={`text-xl max-w-3xl mx-auto drop-shadow-lg ${heroImage ? 'text-white' : 'text-deep-earth-brown'}`}>
          We're passionate about sustainable farming, quality livestock, and building a community 
          around traditional homesteading values.
        </p>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <AboutHero />

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Bold Farm began with a simple dream: to create a sustainable, family-run operation 
                that could provide quality livestock and products while preserving traditional farming methods.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a small homestead has grown into a thriving farm that specializes in 
                Nigerian Dwarf dairy goats, family cows, and a variety of homestead products. We believe 
                in the importance of knowing where your food comes from and supporting local agriculture.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to quality extends beyond our animals to every aspect of our operation, 
                from the care we provide to the products we create.
              </p>
            </div>
            <AboutStoryImage />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at The Bold Farm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Animal Welfare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We prioritize the health and happiness of all our animals, ensuring they receive 
                  the best care possible.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our farming practices focus on environmental stewardship and long-term sustainability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe in building strong relationships with our customers and neighbors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every animal and product we offer meets our high standards for quality and excellence.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From livestock breeding to homestead products, we offer a variety of services and products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cream border border-meadow-green/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Livestock Breeding</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Nigerian Dwarf dairy goats for sale</li>
                <li>• Family cow breeding program</li>
                <li>• Chicken and egg production</li>
                <li>• Quality genetics and health testing</li>
              </ul>
            </div>

            <div className="bg-cream border border-meadow-green/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Homestead Products</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Handmade soaps and lotions</li>
                <li>• Farm-themed clothing and accessories</li>
                <li>• Fresh farm products when available</li>
                <li>• Custom orders welcome</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Looking to the Future</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            We're excited to expand our offerings to include workshops, farm tours, and educational 
            programs. Our goal is to share our knowledge and passion for sustainable farming with 
            others who share our vision.
          </p>
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Homesteading workshops and classes</li>
              <li>• Farm tours and educational visits</li>
              <li>• Expanded produce offerings</li>
              <li>• Community events and gatherings</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

async function AboutStoryImage() {
  // First try to get assigned image, then fall back to album images, then fallback image
  let storyImage: string | null = await getImageForSection('about-story-image');
  if (!storyImage) {
    const storyImages = await getImagesFromAlbums(['farm', 'animals', 'goats', 'Farm', 'Animals', 'Goats']);
    storyImage = storyImages.length > 0 ? storyImages[0] : null;
  }
  // Use fallback image if no image found
  if (!storyImage) {
    storyImage = DEFAULT_FALLBACK_IMAGE;
  }

  return (
    <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden">
      {storyImage ? (
        <Image
          src={storyImage}
          alt="The Bold Farm"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="bg-gradient-growth rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🐐</div>
        </div>
      )}
    </div>
  );
}
