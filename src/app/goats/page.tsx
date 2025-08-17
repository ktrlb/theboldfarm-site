"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { getGoatAge, getGoatPlaceholder } from "@/lib/data";
import { useSupabase } from "@/lib/supabase-context";



export default function GoatsPage() {
  const { goats, loading, error } = useSupabase();
  const availableGoats = goats;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading goats...</p>
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
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Goats for Sale
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality Nigerian Dwarf goats available for your homestead. All our goats are healthy, 
            well-socialized, and come with ongoing support.
          </p>
        </div>
      </section>

      {/* Pricing & Deposit Info */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Prices vary based on registration status, age, and genetics. 
                  Contact us for current pricing on specific animals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  $100 deposit required to reserve any goat or kidding. 
                  Deposits are applied to the final purchase price.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Quality Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All goats come with health records and our commitment to ongoing support 
                  and advice.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Goats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Goats</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our current selection of available goats. Each one has been carefully 
              selected and raised with love and attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableGoats.map((goat) => (
              <Card key={goat.id} className="hover:shadow-lg transition-shadow">
                <div className="h-64 bg-orange-100 rounded-t-lg overflow-hidden">
                  {goat.photos.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={goat.photos[0]}
                        alt={`${goat.name}`}
                        className="w-full h-full object-cover"
                      />
                      {goat.photos.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          +{goat.photos.length - 1} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-8xl">{getGoatPlaceholder(goat)}</div>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{goat.name}</CardTitle>
                    <Badge 
                      variant={goat.status === "Available" ? "default" : "secondary"}
                      className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                    >
                      {goat.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-700">
                    {goat.type} • {getGoatAge(goat)} • {goat.horn_status}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-medium">${goat.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      <span>{goat.registered ? "Registered" : "Unregistered"}</span>
                    </div>
                    {goat.dam && goat.sire && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Dam:</span> {goat.dam} • <span className="font-medium">Sire:</span> {goat.sire}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {goat.bio}
                  </p>

                  {goat.status === "Available" ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Place $100 Deposit
                      </Button>
                      <Button variant="outline" className="w-full">
                        Contact About This Goat
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <Badge variant="secondary" className="text-gray-600">
                        Currently Reserved
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Kiddings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Kiddings</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reserve your spot for upcoming kids! We'll have several litters available 
              throughout the year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐐</div>
              </div>
              <CardHeader>
                <CardTitle>Spring 2024 Kidding</CardTitle>
                <CardDescription>
                  Expected: March-April 2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Several of our does are due to kid this spring. Kids will be available 
                  for reservation with a $100 deposit.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Reserve Your Spot
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-orange-100 rounded-t-lg flex items-center justify-center">
                <div className="text-6xl">🐐</div>
              </div>
              <CardHeader>
                <CardTitle>Fall 2024 Kidding</CardTitle>
                <CardDescription>
                  Expected: September-October 2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fall kidding season will bring more adorable kids. Perfect timing for 
                  those planning spring milk production.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Reserve Your Spot
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Add Goats to Your Homestead?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking for a specific goat or want to learn more about our 
            breeding program, we're here to help you find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/animals">Learn About Our Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
