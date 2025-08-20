import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our goats, want to visit the farm, or interested in our products? 
            We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goats">Goat Information/Sales</SelectItem>
                      <SelectItem value="cows">Cow Information/Sales</SelectItem>
                      <SelectItem value="products">Product Inquiries</SelectItem>
                      <SelectItem value="visit">Farm Visit</SelectItem>
                      <SelectItem value="workshop">Workshop Information</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                  Send Message
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
                      <Mail className="h-5 w-5 mr-2 text-orange-600" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <a href="mailto:karlie@theboldfarm.com" className="text-orange-600 hover:text-orange-700">
                        karlie@theboldfarm.com
                      </a>
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Visit by appointment only<br />
                      We're located in [Your Area] and welcome visitors who want to see our animals 
                      and learn more about our operation.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
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
              <div className="bg-orange-50 rounded-lg p-6">
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
