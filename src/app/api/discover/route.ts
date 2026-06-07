import { NextResponse } from "next/server";
import { platformOf, type Platform } from "@/lib/platforms";
import {
  createGitHubHeaders,
  GITHUB_API_BASE,
  type GitHubRelease,
  type GitHubRepo,
  type GitHubSearchResponse,
} from "@/lib/github";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import type { DiscoverApp } from "@/types";

export const dynamic = "force-dynamic";

const CATEGORY_QUERIES: Record<string, string[]> = {
  all: [
    "stars:>1000 topic:desktop-app",
    "stars:>1000 topic:self-hosted",
    "stars:>2000",
  ],
  "dev-tools": [
    "stars:>500 topic:developer-tools",
    "stars:>500 topic:dev-tools",
    "stars:>1000 developer tool",
  ],
  productivity: [
    "stars:>500 topic:productivity",
    "stars:>500 markdown editor",
    "stars:>500 note-taking",
  ],
  security: [
    "stars:>500 topic:security",
    "stars:>500 topic:privacy",
    "stars:>500 password manager",
  ],
  media: [
    "stars:>500 topic:media",
    "stars:>500 media player",
    "stars:>500 video streaming",
  ],
  design: [
    "stars:>300 topic:design",
    "stars:>300 graphic design",
    "stars:>300 painting tool",
  ],
  "self-hosted": [
    "stars:>500 topic:self-hosted",
    "stars:>500 home automation",
  ],
  ai: [
    "stars:>500 topic:ai",
    "stars:>500 topic:llm",
    "stars:>500 chatbot",
  ],
  "web-apps": [
    "stars:>500 topic:web-app",
    "stars:>500 topic:pwa",
  ],
};

const CATEGORY_KEYS = new Set(Object.keys(CATEGORY_QUERIES));
const CACHE_TTL = 1000 * 60 * 15;
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGE = 10;
const MAX_QUERY_LENGTH = 80;
const DISCOVER_RATE_LIMIT = 40;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RESPONSE_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
};

interface DiscoverResponse {
  items: DiscoverApp[];
  nextCursor: string | null;
}

interface CacheEntry {
  data: DiscoverResponse;
  expiry: number;
}

const globalCache = new Map<string, CacheEntry>();

function json(
  data: unknown,
  init?: ResponseInit & { headers?: HeadersInit }
) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...RESPONSE_CACHE_HEADERS,
      ...init?.headers,
    },
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateHealthScore(
  stars: number,
  forks: number,
  openIssues: number
): number {
  if (stars <= 0) return 50;
  const ratio = openIssues / (stars + forks + 1);
  const score = 100 - Math.floor(ratio * 150);
  return Math.max(30, Math.min(100, score));
}

function normalizeCategory(value: string | null): string {
  const category = value || "all";
  return CATEGORY_KEYS.has(category) ? category : "all";
}

function parsePage(cursor: string | null): number | null {
  const page = cursor ? Number.parseInt(cursor, 10) : 1;
  if (!Number.isFinite(page) || page < 1 || page > MAX_PAGE) {
    return null;
  }
  return page;
}

function normalizeSearchQuery(value: string | null): string | null {
  if (!value) return "";

  const trimmed = value.trim();
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return null;
  }

  const cleaned = trimmed
    .replace(/[^\w ./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return null;
  }

  return `${cleaned} stars:>50`;
}

function isAppOrWebsite(repo: GitHubRepo, releases: GitHubRelease[]): boolean {
  const desc = (repo.description || "").toLowerCase();
  const name = (repo.name || "").toLowerCase();
  const fullName = (repo.full_name || "").toLowerCase();
  const negativeWords = [
    "tutorial",
    "boilerplate",
    "awesome-",
    "template",
    "roadmap",
    "curated list",
    "interview-prep",
    "exercises",
    "book",
    "leetcode",
  ];

  for (const word of negativeWords) {
    if (desc.includes(word) || name.includes(word) || fullName.includes(word)) {
      return false;
    }
  }

  const hasInstallable = releases.some((release) =>
    (release.assets || []).some((asset) => {
      const platform = platformOf(asset.name);
      return platform && platform !== "web";
    })
  );

  return hasInstallable || !!repo.homepage;
}

async function fetchGitHubJson<T>(url: string, headers: HeadersInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function toDiscoverApp(
  repo: GitHubRepo,
  headers: HeadersInit
): Promise<DiscoverApp | null> {
  const releasesUrl = `${GITHUB_API_BASE}/repos/${repo.full_name}/releases?per_page=10`;
  const releases = await fetchGitHubJson<GitHubRelease[]>(releasesUrl, headers);

  if (!Array.isArray(releases) || !isAppOrWebsite(repo, releases)) {
    return null;
  }

  const platforms = new Set<Platform>();
  for (const release of releases) {
    for (const asset of release.assets || []) {
      const platform = platformOf(asset.name);
      if (platform) {
        platforms.add(platform);
      }
    }
  }

  if (platforms.size === 0 && repo.homepage) {
    platforms.add("web");
  }

  const availablePlatforms = Array.from(platforms).sort();
  const priorities: Platform[] = ["windows", "macos", "linux", "android", "ios"];
  const primaryPlatform =
    priorities.find((platform) => availablePlatforms.includes(platform)) || "web";

  return {
    id: repo.id,
    slug: slugify(repo.full_name),
    name: repo.name,
    owner: repo.owner.login,
    description: repo.description,
    repo_url: repo.html_url,
    homepage: repo.homepage,
    logo_url: repo.owner.avatar_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    health_score: calculateHealthScore(
      repo.stargazers_count,
      repo.forks_count,
      repo.open_issues_count
    ),
    primary_platform: primaryPlatform,
    available_platforms: availablePlatforms,
    updated_at: repo.pushed_at || new Date().toISOString(),
  };
}

function uniqueById(repos: GitHubRepo[]): GitHubRepo[] {
  const seenIds = new Set<number>();
  const uniqueRepos: GitHubRepo[] = [];

  for (const repo of repos) {
    if (!seenIds.has(repo.id)) {
      seenIds.add(repo.id);
      uniqueRepos.push(repo);
    }
  }

  return uniqueRepos;
}

export async function GET(request: Request) {
  const rateLimit = checkRateLimit(
    `discover:${getClientIp(request)}`,
    DISCOVER_RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimit.allowed) {
    return json(
      { items: [], nextCursor: null, error: "Too many discovery requests" },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = normalizeCategory(searchParams.get("category"));
  const page = parsePage(searchParams.get("cursor"));
  const searchQuery = normalizeSearchQuery(searchParams.get("q"));

  if (!page) {
    return json(
      { items: [], nextCursor: null, error: "Invalid page cursor" },
      { status: 400, headers: rateLimitHeaders(rateLimit) }
    );
  }

  if (searchQuery === null) {
    return json(
      { items: [], nextCursor: null, error: "Invalid search query" },
      { status: 400, headers: rateLimitHeaders(rateLimit) }
    );
  }

  const cacheKey = searchQuery
    ? `search:${searchQuery}:${page}`
    : `${category}:${page}`;
  const cached = globalCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return json(cached.data, { headers: rateLimitHeaders(rateLimit) });
  }

  const queries = searchQuery
    ? [searchQuery]
    : CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all;
  const headers = createGitHubHeaders();

  try {
    const searchResults = await Promise.allSettled(
      queries.map((query) => {
        const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(
          query
        )}&sort=stars&order=desc&per_page=15&page=${page}`;
        return fetchGitHubJson<GitHubSearchResponse>(url, headers);
      })
    );

    const repos = searchResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value.items || [] : []
    );

    if (repos.length === 0 && searchResults.some((r) => r.status === "rejected")) {
      throw new Error("All GitHub search requests failed");
    }

    const uniqueRepos = uniqueById(repos);
    const reposToProcess = uniqueRepos.slice(0, 12);
    const appResults = await Promise.allSettled(
      reposToProcess.map((repo) => toDiscoverApp(repo, headers))
    );

    const items = appResults.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : []
    );
    const nextCursor =
      uniqueRepos.length >= 10 && page < MAX_PAGE ? (page + 1).toString() : null;
    const responseData: DiscoverResponse = { items, nextCursor };

    globalCache.set(cacheKey, {
      data: responseData,
      expiry: Date.now() + CACHE_TTL,
    });

    return json(responseData, { headers: rateLimitHeaders(rateLimit) });
  } catch (error) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      {
        items: [],
        nextCursor: null,
        error: "GitHub discovery is temporarily unavailable",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          ...rateLimitHeaders(rateLimit),
        },
      }
    );
  }
}
