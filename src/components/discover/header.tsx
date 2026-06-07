"use client";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLogoClick: () => void;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onOpenSignup?: () => void;
}

const DESKTOP_NAV = CATEGORIES;

export function Header({
  searchQuery,
  onSearchChange,
  onLogoClick,
  selectedCategory,
  onSelectCategory,
  onOpenSignup,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategory = (slug: string) => {
    onSelectCategory(slug);
    setMobileMenuOpen(false);
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

        <nav
          className="no-scrollbar hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex"
          aria-label="Browse categories"
        >
          {DESKTOP_NAV.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => handleCategory(category.slug)}
              className={`nav-link ${
                selectedCategory === category.slug ? "nav-link-active" : ""
              }`}
            >
              <span aria-hidden="true">{category.icon}</span>
              {category.name.replace("Discover ", "")}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="relative w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mute)]"
              aria-hidden="true"
            />
            <input
              id="main-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="search-input"
              placeholder="Search apps"
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            className="btn-secondary-sm nav-cta hidden xl:inline-flex"
            onClick={onOpenSignup}
          >
            Log in
          </button>
          <button
            id="signup-btn"
            type="button"
            className="btn-primary-sm nav-cta"
            onClick={onOpenSignup}
          >
            Sign up
          </button>
        </div>

        <button
          type="button"
          className="btn-icon-circular ml-auto md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--hairline)] bg-[var(--canvas)] px-4 py-4 md:hidden">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mute)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="search-input"
              placeholder="Search apps"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategory(category.slug)}
                className={`nav-link justify-start ${
                  selectedCategory === category.slug ? "nav-link-active" : ""
                }`}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className="btn-secondary-sm" onClick={onOpenSignup}>
              Log in
            </button>
            <button type="button" className="btn-primary-sm" onClick={onOpenSignup}>
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
