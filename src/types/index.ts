export interface DiscoverApp {
  id: number;
  slug: string;
  name: string;
  owner: string;
  description: string | null;
  repo_url: string;
  homepage: string | null;
  logo_url: string | null;
  license?: string | null;
  stars: number;
  forks: number;
  health_score: number;
  primary_platform: string | null;
  available_platforms: string[];
  updated_at: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page?: number;
  size?: number;
}
