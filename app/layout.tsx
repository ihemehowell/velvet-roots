import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductsHydrator } from "@/components/products-hydrator";
import { CartHydrator } from "@/components/cart-hydrator";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Velvet Roots — Hair & Cosmetics",
  description: "Hair bundles, wigs, braiding hair, and cosmetics chosen for texture and true-to-tone shades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <ProductsHydrator />
        <CartHydrator />
        <Header />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}