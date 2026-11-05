import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default function AdminPage() {
  return <AdminApp />;
}
