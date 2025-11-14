"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PastureProvider } from "@/lib/pasture-context";
import { PastureManagementSection } from "@/components/pasture-management-section";

function PastureManagementContent() {
  return <PastureManagementSection />;
}

export default function PastureManagementPage() {
  return (
    <PastureProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pasture Management</h1>
            <p className="text-lg text-gray-600">
              Track grazing rotations, monitor pasture health, and optimize your land management
            </p>
          </div>

          <PastureManagementContent />
        </div>

        <Footer />
      </div>
    </PastureProvider>
  );
}


