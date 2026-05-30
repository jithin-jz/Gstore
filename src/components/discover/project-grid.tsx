import React, { useEffect, useRef } from "react";
import { Activity } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { CATEGORIES } from "@/lib/constants";
import type { DiscoverApp } from "@/types";

interface ProjectGridProps {
  filteredItems: DiscoverApp[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ProjectGrid({
  filteredItems,
  selectedCategory,
  searchQuery,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ProjectGridProps) {
  const categoryName = 
    CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Trending Software";

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Trigger fetch 200px before the element is in view
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-950">
            {selectedCategory === "all" ? "Trending Software" : categoryName}
          </h2>
          <p className="text-xs text-slate-500">
            Live discovery feed from GitHub, filtered and compiled dynamically
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <span>{filteredItems.length} active</span>
        </div>
      </div>

      {isLoading && <SkeletonGrid />}

      {isError && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-sm font-medium">Failed to establish connection to the discover API.</p>
          <p className="text-xs text-slate-400 mt-1">Make sure npm dev server is currently running, then reload.</p>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
          <p className="text-sm font-medium">
            {searchQuery ? "No matching applications found." : "No active releases found in this category on GitHub."}
          </p>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search keywords or switching filters.</p>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {/* Infinite Scroll Anchor Trigger */}
          <div ref={observerRef} className="h-14 w-full flex items-center justify-center mt-10">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm">
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Loading more apps...</span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100/80 shimmer" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-100/80 rounded w-2/3 shimmer" />
              <div className="h-3 bg-slate-100/80 rounded w-1/3 shimmer" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100/80 rounded w-full shimmer" />
            <div className="h-3 bg-slate-100/80 rounded w-4/5 shimmer" />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <div className="h-3 bg-slate-100/80 rounded w-1/4 shimmer" />
            <div className="h-8 bg-slate-100/80 rounded-lg w-20 shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
