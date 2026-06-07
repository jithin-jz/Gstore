import { describe, expect, it } from "vitest";
import {
  isTrustedGitHubAssetUrl,
  isValidGitHubOwner,
  isValidGitHubRepo,
  repoApiPath,
  safeHttpUrl,
} from "./github";

describe("github helpers", () => {
  it("validates repository owner and name path segments", () => {
    expect(isValidGitHubOwner("vercel")).toBe(true);
    expect(isValidGitHubOwner("open-ai")).toBe(true);
    expect(isValidGitHubOwner("-bad")).toBe(false);
    expect(isValidGitHubOwner("bad/owner")).toBe(false);

    expect(isValidGitHubRepo("next.js")).toBe(true);
    expect(isValidGitHubRepo("repo_name")).toBe(true);
    expect(isValidGitHubRepo("../repo")).toBe(false);
    expect(isValidGitHubRepo("bad/repo")).toBe(false);
  });

  it("encodes repository API paths", () => {
    expect(repoApiPath("owner", "repo.name")).toBe("owner/repo.name");
    expect(repoApiPath("owner", "repo name")).toBe("owner/repo%20name");
  });

  it("only accepts safe HTTP URLs for redirects", () => {
    expect(safeHttpUrl("https://example.com", "https://github.com/fallback")).toBe(
      "https://example.com/"
    );
    expect(safeHttpUrl("javascript:alert(1)", "https://github.com/fallback")).toBe(
      "https://github.com/fallback"
    );
  });

  it("only trusts GitHub-controlled asset URLs", () => {
    expect(
      isTrustedGitHubAssetUrl(
        "https://github.com/owner/repo/releases/download/v1/app.exe"
      )
    ).toBe(true);
    expect(isTrustedGitHubAssetUrl("https://objects.githubusercontent.com/file")).toBe(
      true
    );
    expect(isTrustedGitHubAssetUrl("https://example.com/app.exe")).toBe(false);
  });
});
