import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { MenuApp } from "@/components/menu/MenuApp";

export const metadata: Metadata = { title: "Menu" };
export const viewport: Viewport = { themeColor: "#22201e" };

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-leaf" />}>
      <MenuApp />
    </Suspense>
  );
}
