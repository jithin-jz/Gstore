import React from "react";

export function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
      <p>
        GitHub Store — Professional Shadcn UI Redesign. 100% open source.
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-800 font-semibold hover:underline ml-1"
        >
          GitHub Repository
        </a>
      </p>
    </footer>
  );
}
