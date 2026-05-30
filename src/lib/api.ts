import type { DiscoverApp } from "@/types";

/** Typed API client for the GitHub Store Next.js endpoints. */
const BASE = "";

export interface DiscoverResponse {
  items: DiscoverApp[];
  nextCursor: string | null;
}

export async function fetchDiscover(category = "all", query = "", cursor = ""): Promise<DiscoverResponse> {
  const cursorParam = cursor ? `&cursor=${cursor}` : "";
  const queryParam = query ? `&q=${encodeURIComponent(query)}` : "";
  const res = await fetch(`${BASE}/api/discover?category=${category}${queryParam}${cursorParam}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
