import { describe, expect, it } from "vitest";
import { archOf, detectPlatform, extOf, pickBest, platformOf } from "./platforms";

describe("platform helpers", () => {
  it("detects platforms from release filenames", () => {
    expect(extOf("Setup-1.0.0.exe")).toBe("exe");
    expect(platformOf("App-1.0.0.AppImage")).toBe("linux");
    expect(platformOf("Client-2.0.0.dmg")).toBe("macos");
    expect(platformOf("mobile.apk")).toBe("android");
  });

  it("detects common CPU architecture tokens", () => {
    expect(archOf("app-darwin-arm64.dmg")).toBe("arm64");
    expect(archOf("app-linux-x86_64.AppImage")).toBe("x64");
    expect(archOf("app-win32-ia32.exe")).toBe("x86");
  });

  it("detects platforms from user agents", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(
      "windows"
    );
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe(
      "macos"
    );
    expect(detectPlatform("Mozilla/5.0 (Linux; Android 14)")).toBe("android");
  });

  it("picks the best matching asset by platform, extension, and architecture", () => {
    const asset = pickBest(
      [
        {
          name: "app-x64.dmg",
          download_url: "https://github.com/example/app-x64.dmg",
          extension: "dmg",
          platform: "macos",
          arch: "x64",
        },
        {
          name: "app-arm64.dmg",
          download_url: "https://github.com/example/app-arm64.dmg",
          extension: "dmg",
          platform: "macos",
          arch: "arm64",
        },
      ],
      "macos",
      "arm64"
    );

    expect(asset?.name).toBe("app-arm64.dmg");
  });
});
