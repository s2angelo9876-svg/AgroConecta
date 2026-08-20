import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AgroConecta — Del campo al comprador, sin intermediarios",
  description:
    "Plataforma que conecta agricultores con compradores: restaurantes, hoteles, supermercados, agroindustrias y más.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="es" className={poppins.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers session={session}>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
