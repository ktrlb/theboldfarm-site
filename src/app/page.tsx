import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Egg, Leaf } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 farm-gradient opacity-90"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 text-shadow">
            The Bold Farm
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Quality Nigerian Dwarf dairy goats, family cows, and homestead products. 
            Building a sustainable future, one animal at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/goats">View Available Goats</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn About Our Farm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From quality livestock to homestead products, we&apos;re committed to sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Nigerian Dwarf Goats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quality dairy goats known for their sweet milk and friendly personalities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Family Cows</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Beef and dairy cows perfect for family farms and homesteads.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Egg className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Fresh Eggs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Farm-fresh eggs from our happy, free-range chickens.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Homestead Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Handmade soaps, t-shirts, and other farm-inspired goods.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Homestead Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for quality livestock or want to learn more about sustainable farming, 
            we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/animals">Meet Our Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
