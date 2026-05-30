"use client";

import { useEffect, useState } from "react";
import type { DiscoverApp } from "@/types";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Download, Star, ShieldCheck, Cpu, Globe, Laptop, Smartphone } from "lucide-react";

// Platform icons from Lucide
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  windows: <Laptop className="w-3 h-3" />,
  macos: <Cpu className="w-3 h-3" />,
  linux: <Cpu className="w-3 h-3" />,
  android: <Smartphone className="w-3 h-3" />,
  ios: <Smartphone className="w-3 h-3" />,
  web: <Globe className="w-3 h-3" />,
};

const PLATFORM_LABELS: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
};

export function ProjectCard({ project }: { project: DiscoverApp }) {
  const [platform, setPlatform] = useState<string>("web");

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("android")) setPlatform("android");
    else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) setPlatform("ios");
    else if (ua.includes("windows")) setPlatform("windows");
    else if (ua.includes("mac os") || ua.includes("macintosh") || ua.includes("darwin")) setPlatform("macos");
    else if (ua.includes("linux")) setPlatform("linux");
    else setPlatform("web");
  }, []);

  const isCompatible = project.available_platforms.includes(platform);
  const isWebOnly = project.available_platforms.length === 1 && project.available_platforms[0] === "web";

  let buttonText = "Install";
  let buttonIcon: React.ReactNode = <Download className="w-3.5 h-3.5" />;
  let downloadUrl = `/api/download/${project.owner}/${project.name}`;

  if (isCompatible) {
    buttonIcon = PLATFORM_ICONS[platform] || <Download className="w-3.5 h-3.5" />;
    buttonText = `Install`;
  } else if (isWebOnly) {
    buttonIcon = <Globe className="w-3.5 h-3.5" />;
    buttonText = "Open Web";
    downloadUrl = project.homepage ?? project.repo_url;
  } else {
    buttonIcon = <Download className="w-3.5 h-3.5" />;
    buttonText = "Get App";
  }

  const ratingVal = (4.2 + ((project.stars * 3) % 8) / 10).toFixed(1);

  return (
    <Card className="shadcn-card-hover flex flex-col justify-between border-slate-200/80 bg-white">
      <CardHeader className="flex flex-row items-center gap-4 p-5 pb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100/50 shrink-0">
          {project.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.logo_url} alt={project.name} className="w-full h-full object-cover animate-fade-in" />
          ) : (
            <span className="text-lg font-bold text-slate-700">
              {project.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 truncate leading-none mb-1.5">{project.name}</h3>
          <p className="text-xs text-slate-500 truncate">{project.owner}</p>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 py-0 flex-1">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {project.description ?? "An open source application discovered from GitHub releases."}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-slate-800">{ratingVal}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">{project.health_score}% health</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.available_platforms.map((p) => (
            <Badge key={p} variant="secondary" className="px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border-slate-100 text-slate-600 bg-slate-100">
              {PLATFORM_ICONS[p]}
              <span>{PLATFORM_LABELS[p] || p}</span>
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          ★ {project.stars.toLocaleString()} stars
        </div>
        <a
          href={downloadUrl}
          target={isWebOnly ? "_blank" : undefined}
          rel={isWebOnly ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg px-4 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          {buttonIcon}
          <span>{buttonText}</span>
        </a>
      </CardFooter>
    </Card>
  );
}
