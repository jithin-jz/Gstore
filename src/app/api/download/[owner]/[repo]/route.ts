import { NextResponse } from "next/server";
import {
  archOf,
  detectPlatform,
  extOf,
  pickBest,
  platformOf,
  type Asset,
} from "@/lib/platforms";
import {
  createGitHubHeaders,
  GITHUB_API_BASE,
  isTrustedGitHubAssetUrl,
  isValidGitHubOwner,
  isValidGitHubRepo,
  repoApiPath,
  safeHttpUrl,
  type GitHubRelease,
  type GitHubRepo,
} from "@/lib/github";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 8000;
const DOWNLOAD_RATE_LIMIT = 80;
const RATE_LIMIT_WINDOW_MS = 60_000;

async function fetchGitHubJson<T>(
  url: string,
  headers: HeadersInit
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function redirectTo(url: string, headers: HeadersInit) {
  return NextResponse.redirect(url, {
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;

  if (!isValidGitHubOwner(owner) || !isValidGitHubRepo(repo)) {
    return NextResponse.json(
      { error: "Invalid repository path" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const rateLimit = checkRateLimit(
    `download:${getClientIp(request)}`,
    DOWNLOAD_RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS
  );
  const responseHeaders = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many download requests" },
      { status: 429, headers: { "Cache-Control": "no-store", ...responseHeaders } }
    );
  }

  const encodedPath = repoApiPath(owner, repo);
  const githubUrl = `https://github.com/${encodedPath}`;
  let fallbackUrl = githubUrl;

  const userAgent = request.headers.get("user-agent") || "";
  const platform = detectPlatform(userAgent);
  const uaLower = userAgent.toLowerCase();
  const arch =
    uaLower.includes("arm64") || uaLower.includes("aarch64") ? "arm64" : "x64";
  const headers = createGitHubHeaders();

  try {
    const repoData = await fetchGitHubJson<GitHubRepo>(
      `${GITHUB_API_BASE}/repos/${encodedPath}`,
      headers
    );

    if (repoData) {
      const safeGithubUrl = safeHttpUrl(repoData.html_url, githubUrl);
      fallbackUrl = safeHttpUrl(repoData.homepage, safeGithubUrl);
    }

    if (platform === "web") {
      return redirectTo(fallbackUrl, responseHeaders);
    }

    const releases = await fetchGitHubJson<GitHubRelease[]>(
      `${GITHUB_API_BASE}/repos/${encodedPath}/releases?per_page=10`,
      headers
    );

    if (!Array.isArray(releases) || releases.length === 0) {
      return redirectTo(fallbackUrl, responseHeaders);
    }

    const targetRelease =
      releases.find((release) => !release.prerelease && release.assets?.length) ||
      releases.find((release) => release.assets?.length);

    const wrappedAssets: Asset[] = (targetRelease?.assets || []).map((asset) => ({
      name: asset.name,
      download_url: asset.browser_download_url,
      extension: extOf(asset.name),
      platform: platformOf(asset.name),
      arch: archOf(asset.name),
    }));

    const bestAsset = pickBest(wrappedAssets, platform, arch);
    if (bestAsset && isTrustedGitHubAssetUrl(bestAsset.download_url)) {
      return redirectTo(bestAsset.download_url, responseHeaders);
    }

    return redirectTo(fallbackUrl, responseHeaders);
  } catch (error) {
    console.error("Download error:", error);
    return redirectTo(fallbackUrl, responseHeaders);
  }
}
