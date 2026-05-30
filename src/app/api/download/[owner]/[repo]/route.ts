import { NextResponse } from "next/server";
import { detectPlatform, pickBest, extOf, platformOf, archOf, Asset } from "@/lib/platforms";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`;

  const userAgent = request.headers.get("user-agent") || "";
  const platform = detectPlatform(userAgent);
  const uaLower = userAgent.toLowerCase();
  const arch = uaLower.includes("arm64") || uaLower.includes("aarch64") ? "arm64" : "x64";

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "GitHubStore-NextJS"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let homepageUrl = "";
  let githubUrl = `https://github.com/${fullName}`;
  let fallbackUrl = githubUrl;

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers,
      next: { revalidate: 3600 }
    });
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      homepageUrl = repoData.homepage || "";
      githubUrl = repoData.html_url || githubUrl;
      fallbackUrl = homepageUrl || githubUrl;
    }

    if (platform === "web") {
      return NextResponse.redirect(fallbackUrl);
    }

    const releasesRes = await fetch(`https://api.github.com/repos/${fullName}/releases?per_page=10`, {
      headers,
      next: { revalidate: 3600 }
    });
    
    if (!releasesRes.ok) {
      return NextResponse.redirect(fallbackUrl);
    }

    const releases = await releasesRes.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return NextResponse.redirect(fallbackUrl);
    }

    let targetRelease = null;
    for (const r of releases) {
      if (!r.prerelease && r.assets && r.assets.length > 0) {
        targetRelease = r;
        break;
      }
    }
    if (!targetRelease && releases.length > 0) {
      targetRelease = releases[0];
    }

    const assets = targetRelease?.assets || [];
    const wrappedAssets: Asset[] = assets.map((a: any) => ({
      name: a.name,
      download_url: a.browser_download_url,
      extension: extOf(a.name),
      platform: platformOf(a.name),
      arch: archOf(a.name)
    }));

    const bestAsset = pickBest(wrappedAssets, platform, arch);
    if (bestAsset) {
      return NextResponse.redirect(bestAsset.download_url);
    }

    return NextResponse.redirect(fallbackUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.redirect(fallbackUrl);
  }
}
