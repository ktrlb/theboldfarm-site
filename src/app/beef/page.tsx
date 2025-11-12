"use client";

import { useState } from "react";
import { BeefHero } from "@/components/beef-hero";
import { BeefInterestModal } from "@/components/beef-interest-modal";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Package, CheckCircle2, Clock, DollarSign, Truck } from "lucide-react";
import Link from "next/link";

export default function BeefPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      <BeefHero />
      <BeefInterestModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Available Options */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-deep-earth-brown">
            Available Options
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Quarter Cow</CardTitle>
                <CardDescription>Perfect for smaller families or first-time buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Approximately 80-100 pounds of take-home beef</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>4-5 cubic feet of freezer space needed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Diverse selection of cuts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Half Cow</CardTitle>
                <CardDescription>Ideal for larger families or those who want more variety</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Approximately 160-200 pounds of take-home beef</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>8-10 cubic feet of freezer space needed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-fresh-sprout-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maximum variety and value</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-deep-earth-brown">
            What You'll Get
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-growth border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Each Share Includes a Variety of Cuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-deep-earth-brown">Premium Cuts</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Ribeye steaks</li>
                      <li>• Sirloin steaks</li>
                      <li>• T-bone steaks</li>
                      <li>• Other premium steaks</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-deep-earth-brown">Other Cuts</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Roasts (chuck, rump, arm)</li>
                      <li>• Ground beef</li>
                      <li>• Stew meat</li>
                      <li>• Other cuts based on your preferences</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> All cuts are customizable based on your preferences and cut sheet selections.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-deep-earth-brown">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-growth flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <CardTitle className="text-2xl font-serif">Submit Your Interest Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Reserve your beef share by filling out our interest form. You'll have the option to select a specific animal or sign up for the next available cow.
                </p>
                <div className="bg-gradient-growth/10 border border-fresh-sprout-green/30 p-4 rounded-lg mb-4">
                  <p className="text-gray-700">
                    <strong className="text-fresh-sprout-green">Deposit Required:</strong> To officially reserve your spot, a $250 deposit is required. This deposit will be sent as an invoice to your email and will be applied toward your final payment.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-growth hover:opacity-90 text-white"
                  >
                    Fill Out Interest Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-growth flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <CardTitle className="text-2xl font-serif">Complete Your Cut Sheet</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This is where you customize your beef! Tell us your preferences:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• How thick do you want your steaks?</li>
                  <li>• What fat percentage for your ground beef?</li>
                  <li>• Which roasts and cuts do you prefer?</li>
                  <li>• Do you want any custom-made sausage, hotdogs or beef jerky made from the beef?</li>
                  <li>• Any special requests?</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We can guide you through the process and answer any questions you have. Your finalized cut sheet will go to the butcher.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-growth flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <CardTitle className="text-2xl font-serif">Processing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Once your cut sheet is complete, we transport the cow to our trusted local butcher who will process your beef according to your exact specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-growth flex items-center justify-center text-white font-bold text-lg">
                    4
                  </div>
                  <CardTitle className="text-2xl font-serif">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Your cost is based on the hanging weight (the weight after initial processing):
                </p>
                <div className="bg-gradient-growth p-4 rounded-lg space-y-2 text-gray-700">
                  <p>• You pay Bold Farm for your share per pound of hanging weight (approx $6.00-$6.50/lb)</p>
                  <p>• You pay the butcher separately for processing fees based on your cut preferences (approx $1.50/lb)</p>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  <strong>Note:</strong> Hanging weight is typically 60% of live weight, and your take-home weight is typically 60-65% of hanging weight.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-growth flex items-center justify-center text-white font-bold text-lg">
                    5
                  </div>
                  <CardTitle className="text-2xl font-serif">Pick Up Your Beef</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You'll be contacted when your beef is ready for pickup at the butcher in Weatherford, TX. Your meat will be sealed, labeled, and frozen—ready for your freezer!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Availability & Waitlist */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-deep-earth-brown">
            Availability & Waitlist
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white border border-meadow-green/30">
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Due to high demand and our commitment to quality, we typically maintain a waitlist for beef shares.
                </p>
                <p className="text-gray-700 mb-6">
                  Want to be added to the waitlist? Email us at{" "}
                  <a href="mailto:karlie@theboldfarm.com" className="text-fresh-sprout-green hover:text-meadow-green underline font-semibold">
                    karlie@theboldfarm.com
                  </a>{" "}
                  and we'll notify you as soon as the next beef share becomes available, or fill out this form.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-growth hover:opacity-90 text-white"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-deep-earth-brown">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-xl font-serif">How much beef will I actually get?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  A standard quarter cow yields approximately 80-100 pounds of take-home beef. A half cow yields approximately 160-200 pounds. We generally raise very large beef cows, so we have had total cow weights over 600 pounds in recent years.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-xl font-serif">How much does it cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Final cost depends on the hanging weight and your cut preferences. Generally, you end up with much higher quality beef at around the same cost as basic grocery-store meat.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-xl font-serif">How long does the beef last?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Properly frozen beef maintains quality for 12-18 months.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-xl font-serif">What if I don't have room in my freezer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Many of our customers purchase a chest freezer specifically for their beef share—it's a worthwhile investment!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-meadow-green/30">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Is your beef grass-fed? Organic?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our current herd of cows received a small scoop of grain twice a day, so they are not exclusively grass fed or organic (we find this helps us lay eyes on the cows daily to perform a health check and makes them friendly). However, this makes up a small portion of their diet and they are primarily on our rotational pasture system. We did have to supplement with one round-bale of local hay this past year. Much "grass-fed" beef is fed primarily hay and we strive to move towards exclusive grazing.
                </p>
                <p className="text-gray-700 mt-2">
                  We do not do a heavy grain-finish on our beef.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-growth">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
            Ready to Reserve Your Beef?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Have questions? We're here to help! Reach out and we'll walk you through the entire process.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => setModalOpen(true)}
              size="lg" 
              className="bg-white text-fresh-sprout-green hover:bg-cream"
            >
              Beef Interest/Reservation Form
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/contact?why=Beef%20Information/Sales">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

