import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrder } from "@/components/order/TrackOrder";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-leaf" />}>
      <TrackOrder />
    </Suspense>
  );
}
