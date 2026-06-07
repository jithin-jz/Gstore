export const GITHUB_API_BASE = "https://api.github.com";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  owner: {
    login: string;
    avatar_url: string | null;
  };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string | null;
}

export interface GitHubSearchResponse {
  items?: GitHubRepo[];
}

export interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GitHubRelease {
  prerelease: boolean;
  assets?: GitHubReleaseAsset[];
}

export function createGitHubHeaders(token = process.env.GITHUB_TOKEN): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "GitHubStore-NextJS",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function isValidGitHubOwner(owner: string): boolean {
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(owner);
}

export function isValidGitHubRepo(repo: string): boolean {
  return /^[A-Za-z0-9._-]{1,100}$/.test(repo) && !repo.includes("..");
}

export function repoApiPath(owner: string, repo: string): string {
  return `${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

export function safeHttpUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function isTrustedGitHubAssetUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "github.com" ||
        url.hostname === "objects.githubusercontent.com" ||
        url.hostname.endsWith(".githubusercontent.com"))
    );
  } catch {
    return false;
  }
}
