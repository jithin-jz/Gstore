import { NextResponse } from "next/server";
import { platformOf } from "../../../lib/platforms";

export const dynamic = "force-dynamic";

const CATEGORY_QUERIES: Record<string, string[]> = {
  all: [
    "stars:>1000 topic:desktop-app",
    "stars:>1000 topic:self-hosted",
    "stars:>2000"
  ],
  "dev-tools": [
    "stars:>500 topic:developer-tools",
    "stars:>500 topic:dev-tools",
    "stars:>1000 developer tool"
  ],
  productivity: [
    "stars:>500 topic:productivity",
    "stars:>500 markdown editor",
    "stars:>500 note-taking"
  ],
  security: [
    "stars:>500 topic:security",
    "stars:>500 topic:privacy",
    "stars:>500 password manager"
  ],
  media: [
    "stars:>500 topic:media",
    "stars:>500 media player",
    "stars:>500 video streaming"
  ],
  design: [
    "stars:>300 topic:design",
    "stars:>300 graphic design",
    "stars:>300 painting tool"
  ],
  "self-hosted": [
    "stars:>500 topic:self-hosted",
    "stars:>500 home automation"
  ],
  ai: [
    "stars:>500 topic:ai",
    "stars:>500 topic:llm",
    "stars:>500 chatbot"
  ],
  "web-apps": [
    "stars:>500 topic:web-app",
    "stars:>500 topic:pwa"
  ]
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateHealthScore(stars: number, forks: number, openIssues: number): number {
  if (stars <= 0) return 50;
  const ratio = openIssues / (stars + forks + 1);
  const score = 100 - Math.floor(ratio * 150);
  return Math.max(30, Math.min(100, score));
}

function isAppOrWebsite(repo: any, releases: any[]): boolean {
  const desc = (repo.description || "").toLowerCase();
  const name = (repo.name || "").toLowerCase();
  const fullName = (repo.full_name || "").toLowerCase();
  
  const negativeWords = ["tutorial", "boilerplate", "awesome-", "template", "roadmap", "curated list", "interview-prep", "exercises", "book", "leetcode"];
  for (const word of negativeWords) {
    if (desc.includes(word) || name.includes(word) || fullName.includes(word)) {
      return false;
    }
  }
  
  let hasInstallable = false;
  for (const r of releases) {
    if (r.assets && Array.isArray(r.assets)) {
      for (const asset of r.assets) {
        const plat = platformOf(asset.name);
        if (plat && plat !== "web") {
          hasInstallable = true;
          break;
        }
      }
    }
    if (hasInstallable) break;
  }
  
  const hasWebsite = !!repo.homepage;
  return hasInstallable || hasWebsite;
}

// Simple in-memory cache to speed up subsequent queries
interface CacheEntry {
  data: {
    items: any[];
    nextCursor: string | null;
  };
  expiry: number;
}
const globalCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const cursor = searchParams.get("cursor") || "1";
  const page = Math.max(1, parseInt(cursor) || 1);
  const q = searchParams.get("q") || "";

  const cacheKey = q ? `search:${q}:${page}` : `${category}:${page}`;
  const cached = globalCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json(cached.data);
  }

  const queries = q ? [q] : (CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all);
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "GitHubStore-NextJS"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const searchPromises = queries.map(async (q) => {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=15&page=${page}`;
      const res = await fetch(url, {
        headers,
        next: { revalidate: 3600 } // Cache GitHub Search response for 1 hour
      });
      if (!res.ok) {
        throw new Error(`GitHub API search failed: ${res.status}`);
      }
      const data = await res.json();
      return data.items || [];
    });

    const searchResults = await Promise.all(searchPromises);
    const allRepos = searchResults.flat();

    // Deduplicate
    const seenIds = new Set<number>();
    const uniqueRepos = [];
    for (const repo of allRepos) {
      if (!seenIds.has(repo.id)) {
        seenIds.add(repo.id);
        uniqueRepos.push(repo);
      }
    }

    // Limit to top 12 repositories per page to process concurrently and speed up load times
    const reposToProcess = uniqueRepos.slice(0, 12);

    const fullApps = await Promise.all(
      reposToProcess.map(async (repo) => {
        try {
          const releasesUrl = `https://api.github.com/repos/${repo.full_name}/releases?per_page=10`;
          const releasesRes = await fetch(releasesUrl, {
            headers,
            next: { revalidate: 3600 } // Cache Releases API response for 1 hour
          });
          const releases = releasesRes.ok ? await releasesRes.json() : [];

          if (!isAppOrWebsite(repo, releases)) {
            return null;
          }

          // Gather platforms
          const platforms = new Set<string>();
          if (Array.isArray(releases)) {
            for (const r of releases) {
              if (r.assets) {
                for (const asset of r.assets) {
                  const plat = platformOf(asset.name);
                  if (plat) {
                    platforms.add(plat);
                  }
                }
              }
            }
          }
          if (platforms.size === 0 && repo.homepage) {
            platforms.add("web");
          }

          const availablePlatforms = Array.from(platforms).sort();

          let primaryPlatform = "web";
          const priorities = ["windows", "macos", "linux", "android", "ios"];
          for (const p of priorities) {
            if (availablePlatforms.includes(p)) {
              primaryPlatform = p;
              break;
            }
          }

          const healthScore = calculateHealthScore(
            repo.stargazers_count,
            repo.forks_count,
            repo.open_issues_count
          );

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
            health_score: healthScore,
            primary_platform: primaryPlatform,
            available_platforms: availablePlatforms,
            updated_at: repo.pushed_at || new Date().toISOString()
          };
        } catch (e) {
          console.error(`Error processing repo ${repo.full_name}:`, e);
          return null;
        }
      })
    );

    const items = fullApps.filter((app) => app !== null);
    
    // If we have returned at least 8 unique search results, assume there is a next page
    const nextCursor = uniqueRepos.length >= 10 ? (page + 1).toString() : null;
    const responseData = { items, nextCursor };

    // Save to in-memory cache
    globalCache.set(cacheKey, {
      data: responseData,
      expiry: Date.now() + CACHE_TTL
    });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Discovery error:", error);
    return NextResponse.json({ items: [], nextCursor: null, error: error.message || "Failed to fetch from GitHub" }, { status: 500 });
  }
}
