"use client";

import { useEffect, useState } from "react";
import { formatRelative } from "@/lib/format";

/** "5 dk önce" gibi göreli süreyi gösterir, 30 saniyede bir kendini günceller. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {formatRelative(iso)}
    </span>
  );
}
