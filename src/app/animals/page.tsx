"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Egg, DollarSign, Award } from "lucide-react";
import Link from "next/link";
import { getGoatAge, getGoatPlaceholder } from "@/lib/data";
import { useSupabase } from "@/lib/supabase-context";
import Image from "next/image";

export default function AnimalsPage() {
  const { goats, loading, error } = useSupabase();
  
  // Filter goats by type for display
  const dairyDoes = goats.filter(goat => goat.type === "Dairy Doe" && goat.status === "Available");
  const breedingBucks = goats.filter(goat => goat.type === "Breeding Buck" && goat.status === "Available");
  const kids = goats.filter(goat => goat.type === "Kid" && goat.status === "Available");

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading farm animals...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading data</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Image
              src="/theboldfarm-logo.png"
              alt="The Bold Farm Logo"
              width={250}
              height={83}
              className="mx-auto h-20 w-auto"
              priority
            />
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get to know the wonderful animals that call The Bold Farm home. Each one has a unique 
            personality and story to share.
          </p>
        </div>
      </section>

      {/* Goats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Heart className="h-10 w-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nigerian Dwarf Goats</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our beloved Nigerian Dwarf goats are the heart of our farm. Known for their sweet milk, 
              friendly personalities, and manageable size, they're perfect for family farms.
            </p>
          </div>

          {/* Dairy Does */}
          {dairyDoes.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Dairy Does</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dairyDoes.map((goat) => (
                  <Card key={goat.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-orange-100 rounded-t-lg overflow-hidden">
                      {goat.photos && goat.photos.length > 0 ? (
                        <img
                          src={goat.photos[0]}
                          alt={`${goat.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-6xl">{getGoatPlaceholder(goat)}</div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{goat.name}</CardTitle>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          ${goat.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium text-gray-700">
                        {getGoatAge(goat)} • {goat.horn_status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {goat.bio}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{goat.registered ? "Registered" : "Unregistered"}</span>
                      </div>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href="/goats">View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Breeding Bucks */}
          {breedingBucks.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Breeding Bucks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {breedingBucks.map((goat) => (
                  <Card key={goat.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-orange-100 rounded-t-lg overflow-hidden">
                      {goat.photos && goat.photos.length > 0 ? (
                        <img
                          src={goat.photos[0]}
                          alt={`${goat.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-6xl">{getGoatPlaceholder(goat)}</div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{goat.name}</CardTitle>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          ${goat.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium text-gray-700">
                        {getGoatAge(goat)} • {goat.horn_status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {goat.bio}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{goat.registered ? "Registered" : "Unregistered"}</span>
                      </div>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href="/goats">View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Kids */}
          {kids.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Kids</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kids.map((goat) => (
                  <Card key={goat.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-orange-100 rounded-t-lg overflow-hidden">
                      {goat.photos && goat.photos.length > 0 ? (
                        <img
                          src={goat.photos[0]}
                          alt={`${goat.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-6xl">{getGoatPlaceholder(goat)}</div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{goat.name}</CardTitle>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          ${goat.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium text-gray-700">
                        {getGoatAge(goat)} • {goat.horn_status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {goat.bio}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{goat.registered ? "Registered" : "Unregistered"}</span>
                      </div>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href="/goats">View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no goats available */}
          {dairyDoes.length === 0 && breedingBucks.length === 0 && kids.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goats Currently Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for new arrivals!</p>
            </div>
          )}

          <div className="text-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/goats">View All Goats</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cows Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Star className="h-10 w-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Family Cows</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our family cows provide both beef and dairy for our family and community. 
              They're gentle giants who love attention and treats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐄</div>
              </div>
              <CardHeader>
                <CardTitle>Dairy Cows</CardTitle>
                <CardDescription>
                  Our dairy cows provide rich milk for our family and local customers. 
                  They're well-trained and easy to handle.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐄</div>
              </div>
              <CardHeader>
                <CardTitle>Beef Cattle</CardTitle>
                <CardDescription>
                  Quality beef cattle raised on pasture with a focus on humane treatment 
                  and sustainable practices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Chickens Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Egg className="h-10 w-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chickens & Eggs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our free-range chickens provide fresh eggs daily and help control pests in our gardens. 
              They're friendly and love kitchen scraps!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐔</div>
              </div>
              <CardHeader>
                <CardTitle>Laying Hens</CardTitle>
                <CardDescription>
                  Happy hens that produce fresh, nutritious eggs daily.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🥚</div>
              </div>
              <CardHeader>
                <CardTitle>Fresh Eggs</CardTitle>
                <CardDescription>
                  Farm-fresh eggs available for sale when we have extras.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐣</div>
              </div>
              <CardHeader>
                <CardTitle>Chicks</CardTitle>
                <CardDescription>
                  Occasionally available chicks for those wanting to start their own flock.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Farm Dogs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Heart className="h-10 w-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Farm Dogs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our loyal farm dogs are more than just pets - they're working members of our team 
              and beloved family companions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐕</div>
              </div>
              <CardHeader>
                <CardTitle>Working Dogs</CardTitle>
                <CardDescription>
                  Our working dogs help with livestock management and farm security. 
                  They're intelligent, loyal, and love their jobs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-64 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐕</div>
              </div>
              <CardHeader>
                <CardTitle>Family Companions</CardTitle>
                <CardDescription>
                  When they're not working, our dogs are loving family pets who enjoy 
                  belly rubs and playing with visitors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Want to Meet Them in Person?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            There's nothing like seeing our animals up close! Schedule a visit to meet our 
            goats, cows, chickens, and farm dogs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/contact">Schedule a Visit</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/goats">View Available Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
