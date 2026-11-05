"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Renders a QR code for `path` on the current site's origin (so it works on any domain you deploy to). */
export function QR({ path, className = "", dark = "#163b2c", light = "#ffffff", onSvg }: {
  path: string; className?: string; dark?: string; light?: string; onSvg?: (svg: string, url: string) => void;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(path, window.location.origin).toString();
    QRCode.toString(url, { type: "svg", margin: 1, color: { dark, light }, errorCorrectionLevel: "M" }).then((s) => {
      setSvg(s);
      onSvg?.(s, url);
    });
  }, [path, dark, light, onSvg]);
  return (
    <div className={className} role="img" aria-label={`QR code linking to ${path}`}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined} />
  );
}
