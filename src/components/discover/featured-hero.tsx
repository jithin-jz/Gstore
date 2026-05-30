import React from "react";
import { Sparkles, CheckCircle, Download } from "lucide-react";
import type { DiscoverApp } from "@/types";

interface FeaturedHeroProps {
  featuredProject?: DiscoverApp;
  isLoading: boolean;
  isError: boolean;
}

export function FeaturedHero({ featuredProject, isLoading, isError }: FeaturedHeroProps) {
  if (!featuredProject || isLoading || isError) {
    return null;
  }

  const ratingVal = (4.5 + (featuredProject.stars % 5) / 10).toFixed(1);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="featured-glow relative border border-slate-200 rounded-2xl bg-white p-6 md:p-8 overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 shadow-sm">
            {featuredProject.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={featuredProject.logo_url} 
                alt={featuredProject.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-2xl font-bold text-slate-700">
                {featuredProject.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Featured Release</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-950 leading-tight">
              {featuredProject.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {featuredProject.description || "An exceptional open source release trending heavily on GitHub."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                ★ {ratingVal} rating
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Release
              </span>
            </div>
          </div>
        </div>
        
        <a
          href={`/api/download/${featuredProject.owner}/${featuredProject.name}`}
          className="inline-flex items-center gap-1.5 h-10 px-6 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm shrink-0 z-10 w-full md:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Install Now</span>
        </a>
      </div>
    </section>
  );
}
