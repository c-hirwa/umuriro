"use client";

import { useSearchParams } from "next/navigation";
import { Tracker } from "./ui";

export function TrackOrder() {
  const id = Number(useSearchParams().get("id"));
  return <Tracker id={Number.isFinite(id) ? id : -1} back={{ label: "Order something else", href: "/order" }} />;
}
