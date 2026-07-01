import { Montserrat, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "ZameenHub | Real Estate Marketplace",
  description: "Plot-first real estate discovery for land, shops, flats and verified listings.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth" className={`${montserrat.variable} ${playfair.variable}`}>
        <body
          className={`${montserrat.className} min-h-screen text-brand-ink antialiased`}
          suppressHydrationWarning
        >
          <div className="relative isolate min-h-screen bg-brand-cream">
            <Navbar />
            <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-3 pb-20 pt-[4.5rem] sm:px-4 lg:px-6 lg:pb-8">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
