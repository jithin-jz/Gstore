import { useEffect, useRef } from "react";
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
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "240px", threshold: 0.1 }
    );

    const element = observerRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const categoryName =
    CATEGORIES.find((category) => category.slug === selectedCategory)?.name ||
    "Discover All";
  const sectionTitle = searchQuery
    ? `Results for "${searchQuery}".`
    : selectedCategory === "all"
    ? "Trending open-source apps."
    : `${categoryName}.`;

  return (
    <section id="catalog" className="catalog-section">
      <div className="page-container">
        <div className="section-header">
          <div className="section-title-stack">
            <p className="mono-label mb-3">LIVE DISCOVERY</p>
            <h2 className="type-display-lg">{sectionTitle}</h2>
            <p className="type-body-md mt-3 max-w-2xl text-[var(--body-text)]">
              Curated from GitHub repositories, release assets, and project
              metadata, then ranked for fast scanning across platforms.
            </p>
          </div>

          {!isLoading && !isError && (
            <div className="status-pill mono-label">
              <span className="status-dot" aria-hidden="true" />
              {filteredItems.length} RESULTS
            </div>
          )}
        </div>

        {isLoading && <CatalogSkeletonGrid />}

        {isError && (
          <div className="state-card">
            <p className="type-heading-lg">Discovery API unavailable.</p>
            <p className="type-body-sm mt-2 text-[var(--body-text)]">
              Refresh the page or try a narrower search while GitHub data
              recovers.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredItems.length === 0 && (
          <div className="state-card">
            <p className="type-heading-lg">
              {searchQuery ? "No matching applications found." : "No releases found."}
            </p>
            <p className="type-body-sm mt-2 text-[var(--body-text)]">
              Try another query or switch categories to broaden the catalog.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredItems.length > 0 && (
          <>
            <div className="catalog-grid">
              {filteredItems.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div
              ref={observerRef}
              className="flex h-16 items-center justify-center"
            >
              {isFetchingNextPage && (
                <div className="status-pill mono-label">
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border border-[var(--hairline-strong)] border-t-transparent"
                    aria-hidden="true"
                  />
                  LOADING MORE
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CatalogSkeletonGrid() {
  return (
    <div className="catalog-grid">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="skeleton-card" />
      ))}
    </div>
  );
}
