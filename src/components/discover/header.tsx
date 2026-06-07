"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLogoClick: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onLogoClick,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <header className="primary-nav">
      <div className="primary-nav-inner">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex shrink-0 items-center gap-3"
          aria-label="GitHub Store home"
        >
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-triangle" />
          </span>
          <span className="hidden text-sm font-semibold text-[var(--ink)] sm:inline">
            GitHub Store
          </span>
        </button>

        <div className="nav-search-wrap hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mute)]"
            aria-hidden="true"
          />
          <label htmlFor="desktop-search" className="sr-only">
            Search catalog
          </label>
          <input
            id="desktop-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="search-input"
            placeholder="Search apps, tools, repos"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-icon-circular ml-auto sm:hidden"
          onClick={() => setMobileSearchOpen((open) => !open)}
          aria-label={mobileSearchOpen ? "Close search" : "Open search"}
          aria-expanded={mobileSearchOpen}
          aria-controls="mobile-search-panel"
        >
          {mobileSearchOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileSearchOpen && (
        <div
          id="mobile-search-panel"
          className="mobile-search-panel sm:hidden"
        >
          <Search
            className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mute)]"
            aria-hidden="true"
          />
          <label htmlFor="mobile-search" className="sr-only">
            Search catalog
          </label>
          <input
            id="mobile-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="search-input"
            placeholder="Search apps, tools, repos"
            autoComplete="off"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
