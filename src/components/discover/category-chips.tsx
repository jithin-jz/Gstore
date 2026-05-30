import React from "react";
import { CATEGORIES } from "@/lib/constants";

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <div className="chips-container no-scrollbar max-w-6xl mx-auto px-4 pb-3">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`inline-flex items-center gap-1.5 h-8 px-4 rounded-full border text-xs font-semibold transition-all select-none ${
              isActive
                ? "bg-slate-900 border-transparent text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
