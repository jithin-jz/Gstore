"use client";

import React, { useState } from "react";
import { Header } from "@/components/discover/header";
import { ProjectGrid } from "@/components/discover/project-grid";
import { Footer } from "@/components/shared/footer";
import { SignupModal } from "@/components/shared/signup-modal";
import { useDiscover } from "@/hooks/use-discover";

export default function Home() {
  const [signupOpen, setSignupOpen] = useState(false);

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

  return (
    <main className="page-shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={() => setSelectedCategory("all")}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSignup={() => setSignupOpen(true)}
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

      {signupOpen && <SignupModal onClose={() => setSignupOpen(false)} />}
    </main>
  );
}
