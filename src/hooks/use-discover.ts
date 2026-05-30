import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDiscover } from "@/lib/api";
import type { DiscoverApp } from "@/types";

export function useDiscover() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Debounce search query updates to throttle API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["discover", selectedCategory, debouncedSearchQuery],
    queryFn: ({ pageParam = "" }) => 
      fetchDiscover(selectedCategory, debouncedSearchQuery, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "",
  });

  // Flat-map items across all loaded pages
  const filteredItems: DiscoverApp[] = data?.pages.flatMap((page) => page.items) ?? [];

  const featuredProject: DiscoverApp | undefined = 
    filteredItems.find((p) => p.logo_url && p.description) || filteredItems[0];

  return {
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
  };
}
