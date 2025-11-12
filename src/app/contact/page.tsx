"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactHero } from "@/components/contact-hero";
import { toast } from "sonner";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    why: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form from URL query params
  useEffect(() => {
    const why = searchParams.get('why');
    if (why) {
      setFormData(prev => ({ ...prev, why: decodeURIComponent(why) }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", why: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <ContactHero />

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="why">Why *</Label>
                  <Select 
                    value={formData.why} 
                    onValueChange={(value) => setFormData({ ...formData, why: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goat Information/Sales">Goat Information/Sales</SelectItem>
                      <SelectItem value="Beef Information/Sales">Beef Information/Sales</SelectItem>
                      <SelectItem value="Cow Information/Sales">Cow Information/Sales</SelectItem>
                      <SelectItem value="Product Inquiries">Product Inquiries</SelectItem>
                      <SelectItem value="Farm Visit">Farm Visit</SelectItem>
                      <SelectItem value="Workshop Information">Workshop Information</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows={5}
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-growth hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We're here to help answer your questions and help you find the perfect additions 
                  to your homestead.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-honey-gold" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <a href="mailto:karlie@theboldfarm.com" className="text-honey-gold hover:text-fresh-sprout-green">
                        karlie@theboldfarm.com
                      </a>
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-honey-gold" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Visit by appointment only<br />
                      We're located in Hood County, Texas and welcome visitors who want to see our animals 
                      and learn more about our operation.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-honey-gold" />
                      Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      We typically respond to inquiries within 24-48 hours. For urgent matters, 
                      please include "URGENT" in your subject line.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Visit Information */}
              <div className="bg-cream border border-meadow-green/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Planning a Visit?</h3>
                <p className="text-gray-600 mb-4">
                  We love sharing our farm with visitors! Here's what you should know:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Visits are by appointment only</li>
                  <li>• Wear appropriate footwear (farm conditions)</li>
                  <li>• Children are welcome with supervision</li>
                  <li>• We can accommodate small groups</li>
                  <li>• Photography is encouraged!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Common questions about our animals and services.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How do I reserve a goat?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We require a $100 deposit to reserve any goat or kidding. This secures your spot 
                  and helps us plan our breeding program. The deposit is applied to the final price.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Are your goats registered?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We offer both registered and unregistered goats. Registered goats come with full 
                  pedigree papers and are typically priced higher. All goats are healthy and well-cared for.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you ship animals?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We prefer local pickup to ensure the safety and comfort of our animals. However, 
                  we can work with reputable livestock transporters for longer distances.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's included with goat purchases?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All goats come with health records, basic care instructions, and ongoing support. 
                  We're always here to help with questions about care and management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fresh-sprout-green"></div>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
