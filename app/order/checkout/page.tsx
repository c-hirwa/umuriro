import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Checkout } from "@/components/order/Checkout";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main><Checkout /></main>
    </>
  );
}
