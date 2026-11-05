import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OrderApp } from "@/components/order/OrderApp";

export const metadata: Metadata = {
  title: "Order online",
  description: "Order Umuriro's brochettes, grilled tilapia and weekend brunch for pickup or delivery across Kigali.",
};

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main><OrderApp /></main>
      <SiteFooter />
    </>
  );
}
