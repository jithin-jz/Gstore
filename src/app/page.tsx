"use client";

import { Header } from "@/components/discover/header";
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
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscover();

  const handleHome = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <main className="page-shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={handleHome}
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
        onSelectCategory={setSelectedCategory}
      />

      <Footer />
    </main>
  );
}
