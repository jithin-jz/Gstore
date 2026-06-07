"use client";

import Image from "next/image";
import { useState } from "react";
import type { DiscoverApp } from "@/types";
import { Download, ExternalLink, ShieldCheck, Star } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
};

function safeExternalLink(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function ProjectCard({ project }: { project: DiscoverApp }) {
  const [imgError, setImgError] = useState(false);
  const isWebOnly =
    project.available_platforms.length === 1 &&
    project.available_platforms[0] === "web";
  const downloadUrl = isWebOnly
    ? safeExternalLink(project.homepage, project.repo_url)
    : `/api/download/${encodeURIComponent(project.owner)}/${encodeURIComponent(project.name)}`;
  const platformTag =
    project.available_platforms.length > 0
      ? PLATFORM_LABELS[project.available_platforms[0]] ?? project.available_platforms[0]
      : "GitHub";
  const showLogo = !!project.logo_url && !imgError;

  return (
    <article className="pin-card">
      <div className="app-card-visual">
        {showLogo ? (
          <div className="app-card-logo-frame">
            <Image
              src={project.logo_url!}
              alt={`${project.name} logo`}
              fill
              sizes="92px"
              onError={() => setImgError(true)}
              className="object-contain p-4 animate-fade-in"
            />
          </div>
        ) : (
          <span className="app-card-fallback" aria-hidden="true">
            {project.name.charAt(0).toUpperCase()}
          </span>
        )}

        <span className="pin-overlay-pill">{platformTag}</span>

        {project.health_score >= 80 && (
          <span className="app-health-pill">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {project.health_score}%
          </span>
        )}
      </div>

      <div className="app-card-body">
        <div className="app-card-title-row">
          <div className="min-w-0">
            <h3 className="app-card-title truncate">{project.name}</h3>
            <p className="app-card-owner mono-label truncate">{project.owner}</p>
          </div>
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon-circular shrink-0"
            aria-label={`Open ${project.name} on GitHub`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <p className="app-card-description type-body-sm line-clamp-2">
          {project.description || "Open-source project indexed from GitHub releases."}
        </p>

        <div className="app-card-footer">
          <span className="app-card-stars mono-label">
            <Star className="h-3.5 w-3.5 fill-[var(--warning)] stroke-[var(--warning)]" />
            {project.stars >= 1000
              ? `${(project.stars / 1000).toFixed(1)}k`
              : project.stars}
          </span>

          <a
            href={downloadUrl}
            target={isWebOnly ? "_blank" : undefined}
            rel={isWebOnly ? "noopener noreferrer" : undefined}
            className="btn-primary-sm"
          >
            {isWebOnly ? (
              <>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Open
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Install
              </>
            )}
          </a>
        </div>
      </div>
    </article>
  );
}
