import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseProvider } from "@/lib/supabase-context";
import { ShopifyProvider } from "@/lib/shopify-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bold Farm - Nigerian Dwarf Goats & Family Cows",
  description: "Quality Nigerian Dwarf dairy goats, family cows, and homestead products. Visit our farm for workshops and events.",
  keywords: "Nigerian Dwarf goats, dairy goats, family cows, homestead, farm, workshops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <ShopifyProvider>
            {children}
          </ShopifyProvider>
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
