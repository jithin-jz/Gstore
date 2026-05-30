import React from "react";
import { Search } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { CATEGORIES } from "@/lib/constants";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLogoClick: () => void;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  onLogoClick,
  selectedCategory,
  onSelectCategory
}: HeaderProps) {
  return (
    <header className="store-header">
      <div className="store-header-inner flex items-center justify-between gap-3">
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 flex-shrink-0" 
        >
          <span className="text-lg text-slate-950 font-extrabold tracking-tight">◆ GitHub Store</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all select-none flex-shrink-0 ${
                  isActive
                    ? "bg-slate-900 border border-slate-900 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 max-w-xs relative flex-shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full h-8 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs outline-none transition-all focus:ring-2 focus:ring-slate-950/10 focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-sm"
            title="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
