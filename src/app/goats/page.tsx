"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { getGoatAge, getGoatPlaceholder, isGoatForSale, getGoatsForSale } from "@/lib/data";
import { useSupabase } from "@/lib/supabase-context";
import Image from "next/image";



// Filter options
const FILTER_OPTIONS = [
  { id: 'all', label: 'All Goats for Sale' },
  { id: 'dairy_doe', label: 'Dairy Does' },
  { id: 'breeding_buck', label: 'Breeding Bucks' },
  { id: 'doeling_kid', label: 'Doeling Kids' },
  { id: 'buckling_kid', label: 'Buckling Kids' },
  { id: 'wether', label: 'Wethers' },
  { id: 'pet_only_doe', label: 'Pet Only Does' }
] as const;

type FilterType = typeof FILTER_OPTIONS[number]['id'];

export default function GoatsPage() {
  const { goats, loading, error } = useSupabase();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedAllGoatsFilter, setSelectedAllGoatsFilter] = useState<FilterType>('all');
  
  const allGoats = goats;
  const goatsForSale = getGoatsForSale(goats);

  // Filter logic
  const filteredGoatsForSale = useMemo(() => {
    if (selectedFilter === 'all') {
      return goatsForSale;
    }

    return goatsForSale.filter(goat => {
      switch (selectedFilter) {
        case 'dairy_doe':
          return goat.type === 'Dairy Doe';
        case 'breeding_buck':
          return goat.type === 'Breeding Buck';
        case 'doeling_kid':
          return goat.type === 'Doeling Kid';
        case 'buckling_kid':
          return goat.type === 'Buckling Kid';
        case 'wether':
          return goat.type === 'Wether';
        case 'pet_only_doe':
          return goat.type === 'Pet Only Doe';
        default:
          return true;
      }
    });
  }, [goatsForSale, selectedFilter]);

  // Filter logic for all goats
  const filteredAllGoats = useMemo(() => {
    if (selectedAllGoatsFilter === 'all') {
      return allGoats;
    }

    return allGoats.filter(goat => {
      switch (selectedAllGoatsFilter) {
        case 'dairy_doe':
          return goat.type === 'Dairy Doe';
        case 'breeding_buck':
          return goat.type === 'Breeding Buck';
        case 'doeling_kid':
          return goat.type === 'Doeling Kid';
        case 'buckling_kid':
          return goat.type === 'Buckling Kid';
        case 'wether':
          return goat.type === 'Wether';
        case 'pet_only_doe':
          return goat.type === 'Pet Only Doe';
        default:
          return true;
      }
    });
  }, [allGoats, selectedAllGoatsFilter]);

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

      {/* Goats for Sale */}
      {goatsForSale.length > 0 && (
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Goats for Sale</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These goats are currently available for purchase. Each one comes with our quality guarantee 
                and ongoing support.
              </p>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {FILTER_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedFilter === option.id ? "default" : "outline"}
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    selectedFilter === option.id
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Showing {filteredGoatsForSale.length} of {goatsForSale.length} goats
                {selectedFilter !== 'all' && (
                  <span className="ml-2 text-orange-600 font-medium">
                    • {FILTER_OPTIONS.find(opt => opt.id === selectedFilter)?.label}
                  </span>
                )}
              </p>
            </div>

            {filteredGoatsForSale.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sorry, we don't have any of those available right now</h3>
                <p className="text-gray-600 mb-6">
                  Check back later for new arrivals in this category.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFilter('all')}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  Show All Goats for Sale
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGoatsForSale.map((goat) => (
                <Card key={goat.id} className="hover:shadow-lg transition-shadow border-2 border-orange-200">
                  <div className="h-64 bg-orange-100 rounded-t-lg overflow-hidden">
                    {goat.photos && goat.photos.length > 0 ? (
                      <div className="relative w-full h-full">
                        <img
                          src={goat.photos[0]}
                          alt={`${goat.name}`}
                          className="w-full h-full object-cover"
                        />
                        {goat.photos && goat.photos.length > 1 && (
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
                        <span className="font-medium text-lg text-orange-600">${goat.price}</span>
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
            )}
          </div>
        </section>
      )}

      {/* All Our Goats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Our Goats</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet all the goats in our herd. Some are for sale, some are part of our breeding program, 
              and some are beloved family members.
            </p>
          </div>

          {/* Filter Tags for All Goats */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedAllGoatsFilter === option.id ? "default" : "outline"}
                onClick={() => setSelectedAllGoatsFilter(option.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedAllGoatsFilter === option.id
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                {option.label === 'All Goats for Sale' ? 'All Goats' : option.label}
              </Button>
            ))}
          </div>

          {/* Results count for All Goats */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredAllGoats.length} of {allGoats.length} goats
              {selectedAllGoatsFilter !== 'all' && (
                <span className="ml-2 text-orange-600 font-medium">
                  • {FILTER_OPTIONS.find(opt => opt.id === selectedAllGoatsFilter)?.label.replace('All Goats for Sale', 'All Goats')}
                </span>
              )}
            </p>
          </div>

          {filteredAllGoats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No goats found in this category</h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category to see our goats.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAllGoatsFilter('all')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                Show All Goats
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAllGoats.map((goat) => (
              <Card key={goat.id} className="hover:shadow-lg transition-shadow">
                <div className="h-64 bg-orange-100 rounded-t-lg overflow-hidden">
                  {goat.photos && goat.photos.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={goat.photos[0]}
                        alt={`${goat.name}`}
                        className="w-full h-full object-cover"
                      />
                      {goat.photos && goat.photos.length > 1 && (
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
                    {isGoatForSale(goat) ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-medium">${goat.price}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-green-600">Not for Sale</span>
                      </div>
                    )}
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

                  {isGoatForSale(goat) && goat.status === "Available" ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Place $100 Deposit
                      </Button>
                      <Button variant="outline" className="w-full">
                        Contact About This Goat
                      </Button>
                    </div>
                  ) : goat.status === "Available" ? (
                    <div className="text-center py-2">
                      <Badge variant="secondary" className="text-gray-600">
                        Not for Sale
                      </Badge>
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
          )}
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
