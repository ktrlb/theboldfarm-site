import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Leaf, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About The Bold Farm
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about sustainable farming, quality livestock, and building a community 
            around traditional homesteading values.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
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
            <div className="bg-orange-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🐐</div>
              <p className="text-lg text-gray-700 font-medium">
                "Building a sustainable future, one animal at a time."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at The Bold Farm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-orange-600" />
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
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-orange-600" />
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
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
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
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-orange-600" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From livestock breeding to homestead products, we offer a variety of services and products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Livestock Breeding</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Nigerian Dwarf dairy goats for sale</li>
                <li>• Family cow breeding program</li>
                <li>• Chicken and egg production</li>
                <li>• Quality genetics and health testing</li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-lg p-8">
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
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Looking to the Future</h2>
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
