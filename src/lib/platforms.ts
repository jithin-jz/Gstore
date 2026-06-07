export type Platform = "windows" | "macos" | "linux" | "android" | "ios" | "web";

const EXT_PLATFORM: Record<string, Platform> = {
  exe: "windows",
  msi: "windows",
  dmg: "macos",
  pkg: "macos",
  appimage: "linux",
  deb: "linux",
  rpm: "linux",
  apk: "android",
  ipa: "ios",
};

const PREFERENCE: Record<string, string[]> = {
  windows: ["msi", "exe"],
  macos: ["dmg", "pkg"],
  linux: ["appimage", "deb", "rpm"],
  android: ["apk"],
  ios: ["ipa"],
};

export function extOf(filename: string): string | null {
  const name = filename.toLowerCase();
  for (const ext of Object.keys(EXT_PLATFORM)) {
    if (name.endsWith("." + ext)) {
      return ext;
    }
  }
  return null;
}

export function platformOf(filename: string): Platform | null {
  const ext = extOf(filename);
  return ext ? EXT_PLATFORM[ext] : null;
}

export function archOf(filename: string): string | null {
  const n = filename.toLowerCase();
  if (n.includes("arm64") || n.includes("aarch64")) {
    return "arm64";
  }
  if (n.includes("x86_64") || n.includes("amd64") || n.includes("x64")) {
    return "x64";
  }
  if (n.includes("arm")) {
    return "arm";
  }
  if (n.includes("ia32") || n.includes("i386") || n.includes("x86") || n.includes("386")) {
    return "x86";
  }
  return null;
}

export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  if (ua.includes("android")) {
    return "android";
  }
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
    return "ios";
  }
  if (ua.includes("windows")) {
    return "windows";
  }
  if (ua.includes("mac os") || ua.includes("macintosh") || ua.includes("darwin")) {
    return "macos";
  }
  if (ua.includes("linux")) {
    return "linux";
  }
  return "web";
}

export interface Asset {
  name: string;
  download_url: string;
  extension: string | null;
  platform: Platform | null;
  arch: string | null;
}

export function pickBest(assets: Asset[], platform: Platform, arch = "x64"): Asset | null {
  const pref = PREFERENCE[platform];
  if (!pref) return null;

  const candidates = assets.filter((a) => a.platform === platform);
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const indexA = a.extension && pref.includes(a.extension) ? pref.indexOf(a.extension) : pref.length;
    const indexB = b.extension && pref.includes(b.extension) ? pref.indexOf(b.extension) : pref.length;
    if (indexA !== indexB) {
      return indexA - indexB;
    }

    const scoreA = a.arch === arch ? 0 : a.arch === null ? 1 : 2;
    const scoreB = b.arch === arch ? 0 : b.arch === null ? 1 : 2;
    return scoreA - scoreB;
  });

  return candidates[0];
}
