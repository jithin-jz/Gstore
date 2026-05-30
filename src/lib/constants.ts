import React from "react";
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Lock, 
  Video, 
  Palette, 
  Home as HomeIcon, 
  Cpu, 
  Globe 
} from "lucide-react";

export interface Category {
  icon: React.ReactNode;
  name: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { icon: React.createElement(Sparkles, { className: "w-3.5 h-3.5" }), name: "Discover All", slug: "all" },
  { icon: React.createElement(Terminal, { className: "w-3.5 h-3.5" }), name: "Developer Tools", slug: "dev-tools" },
  { icon: React.createElement(BookOpen, { className: "w-3.5 h-3.5" }), name: "Productivity", slug: "productivity" },
  { icon: React.createElement(Lock, { className: "w-3.5 h-3.5" }), name: "Security", slug: "security" },
  { icon: React.createElement(Video, { className: "w-3.5 h-3.5" }), name: "Media", slug: "media" },
  { icon: React.createElement(Palette, { className: "w-3.5 h-3.5" }), name: "Design", slug: "design" },
  { icon: React.createElement(HomeIcon, { className: "w-3.5 h-3.5" }), name: "Self Hosted", slug: "self-hosted" },
  { icon: React.createElement(Cpu, { className: "w-3.5 h-3.5" }), name: "AI Tools", slug: "ai" },
  { icon: React.createElement(Globe, { className: "w-3.5 h-3.5" }), name: "Web Apps", slug: "web-apps" },
];
