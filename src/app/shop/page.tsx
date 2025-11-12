import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { ShopHero } from "@/components/shop-hero";

export default function ShopPage() {

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <ShopHero />

      {/* How to Purchase Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <MessageCircle className="h-16 w-16 text-honey-gold mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Purchase Our Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're currently taking orders directly through personal contact. 
              Get in touch with us to learn more about our available products and place your order!
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-honey-gold mx-auto mb-4" />
                <CardTitle>Facebook</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Message us on Facebook for the quickest response about our products and availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Mail className="h-12 w-12 text-honey-gold mx-auto mb-4" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Send us an email with your product inquiries and we'll get back to you within 24 hours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <MapPin className="h-12 w-12 text-honey-gold mx-auto mb-4" />
                <CardTitle>Farmstand Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visit us at popup farmstand events throughout the season to browse and purchase in person.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Product Categories */}
          <div className="bg-gradient-golden-hour rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Farm Products</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Fresh goat milk soap</li>
                  <li>• Farm-raised eggs</li>
                  <li>• Seasonal produce</li>
                  <li>• Honey from our hives</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Merchandise</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• The Bold Farm branded items</li>
                  <li>• Homestead-themed clothing</li>
                  <li>• Farm accessories</li>
                  <li>• Educational materials</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white border-2 border-meadow-green/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
            <p className="text-gray-600 mb-6">
              Contact us through Facebook or email to discuss available products and place your order. 
              We're happy to answer any questions about our farm and products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message on Facebook
              </Button>
              <Button variant="outline" className="border-honey-gold text-honey-gold hover:bg-cream">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
