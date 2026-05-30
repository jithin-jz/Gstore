"use client";

import React from "react";
import { Header } from "@/components/discover/header";
import { FeaturedHero } from "@/components/discover/featured-hero";
import { ProjectGrid } from "@/components/discover/project-grid";
import { Footer } from "@/components/shared/footer";
import { useDiscover } from "@/hooks/use-discover";

export default function Home() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredItems,
    featuredProject,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscover();

  return (
    <main className="min-h-screen bg-background bg-dot-pattern pb-16">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={() => setSelectedCategory("all")}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <FeaturedHero
        featuredProject={featuredProject}
        isLoading={isLoading}
        isError={isError}
      />

      <ProjectGrid
        filteredItems={filteredItems}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      <Footer />
    </main>
  );
}
