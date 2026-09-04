import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { fetchProductsAction } from "@/lib/actions/products";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import MobileStickyCta from "@/components/MobileStickyCta";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "AgroConecta — Del campo al comprador, sin intermediarios",
  description:
    "Plataforma que conecta agricultores con compradores: restaurantes, hotels, supermercados, agroindustrias y más.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialProducts = await fetchProductsAction();

  return (
    <html lang="es" className={poppins.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers initialProducts={initialProducts}>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <MobileNav />
          <MobileStickyCta />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}