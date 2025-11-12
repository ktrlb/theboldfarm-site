import type { Metadata } from "next";
import { DM_Serif_Display, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { DatabaseProvider } from "@/lib/database-context";

// Brand fonts from branding guide
const dmSerifDisplay = DM_Serif_Display({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body className={`${dmSerifDisplay.variable} ${lato.variable} font-sans`}>
        <DatabaseProvider>
          {children}
        </DatabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
