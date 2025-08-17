import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Leaf, Heart } from "lucide-react";

// Mock product data - this would come from your CMS/database
const products = [
  {
    id: 1,
    name: "Lavender Goat Milk Soap",
    category: "Soap",
    price: 6.50,
    description: "Handmade goat milk soap with lavender essential oil. Gentle on skin and perfect for daily use.",
    image: "🧼",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Oatmeal & Honey Soap",
    category: "Soap",
    price: 6.50,
    description: "Nourishing goat milk soap with oatmeal and honey. Great for sensitive skin.",
    image: "🧼",
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: "The Bold Farm T-Shirt",
    category: "Clothing",
    price: 22.00,
    description: "Comfortable cotton t-shirt featuring The Bold Farm logo. Available in multiple sizes.",
    image: "👕",
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Homestead Life T-Shirt",
    category: "Clothing",
    price: 22.00,
    description: "Celebrate the homestead lifestyle with this comfortable, durable t-shirt.",
    image: "👕",
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Goat Milk Lotion",
    category: "Skincare",
    price: 12.00,
    description: "Rich, moisturizing lotion made with fresh goat milk. Perfect for dry, sensitive skin.",
    image: "🧴",
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: "Farm Fresh Eggs",
    category: "Food",
    price: 8.00,
    description: "Fresh farm eggs from our free-range chickens. Available when we have extras.",
    image: "🥚",
    inStock: false,
    featured: false
  }
];

const categories = ["All", "Soap", "Clothing", "Skincare", "Food"];

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Homestead Shop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handcrafted products from our farm to yours. From goat milk soap to farm-themed clothing, 
            we create quality items that celebrate the homestead lifestyle.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular items, handcrafted with care using ingredients from our farm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.featured).map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                  <div className="text-8xl">{product.image}</div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={product.inStock ? "default" : "secondary"}
                      className={product.inStock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-700">
                    {product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.inStock ? (
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of handmade homestead products.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-white hover:bg-orange-50 hover:border-orange-300"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                  <div className="text-8xl">{product.image}</div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge 
                      variant={product.inStock ? "default" : "secondary"}
                      className={product.inStock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-700">
                    {product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.inStock ? (
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Our Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Handcrafted with Love</h2>
              <p className="text-lg text-gray-600 mb-6">
                Every product in our shop is made by hand using ingredients from our farm whenever possible. 
                We believe in quality over quantity and take pride in creating items that our customers love.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our goat milk soap is made with fresh milk from our Nigerian Dwarf goats, while our 
                clothing celebrates the homestead lifestyle we love so much.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Leaf className="h-5 w-5 mr-3 text-orange-600" />
                  <span>Natural ingredients from our farm</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Heart className="h-5 w-5 mr-3 text-orange-600" />
                  <span>Handcrafted with care and attention</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 mr-3 text-orange-600" />
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🧼</div>
              <p className="text-lg text-gray-700 font-medium">
                "From our farm to your home"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need Something Special?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We love creating custom orders! Whether you need a specific soap scent, custom t-shirt design, 
            or bulk order for an event, we're happy to work with you.
          </p>
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Order Options</h3>
            <ul className="space-y-2 text-gray-600 text-left">
              <li>• Custom soap scents and ingredients</li>
              <li>• Bulk orders for events or gifts</li>
              <li>• Custom t-shirt designs</li>
              <li>• Special packaging requests</li>
              <li>• Seasonal product variations</li>
            </ul>
            <Button className="mt-6 bg-orange-600 hover:bg-orange-700">
              Contact About Custom Orders
            </Button>
          </div>
        </div>
      </section>

      {/* Shipping & Policies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping & Policies</h2>
            <p className="text-lg text-gray-600">
              Important information about ordering and shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">• Standard shipping: 5-7 business days</p>
                <p className="text-gray-600">• Local pickup available</p>
                <p className="text-gray-600">• Free shipping on orders over $50</p>
                <p className="text-gray-600">• Soap and lotions ship separately for freshness</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">• 30-day return policy</p>
                <p className="text-gray-600">• Unused items in original packaging</p>
                <p className="text-gray-600">• Custom orders are final sale</p>
                <p className="text-gray-600">• Contact us for return authorization</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
