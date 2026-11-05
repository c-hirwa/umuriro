import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Umuriro Grill House, Kiyovu", template: "%s | Umuriro" },
  description: "Charcoal-grilled brochettes, whole Lake Kivu tilapia and Rwandan plates in Kiyovu, Kigali.",
};

export const viewport: Viewport = { themeColor: "#163b2c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
