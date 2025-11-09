
export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  link: string;
  // Fix: Add the 'count' property, which represents the number of posts in the category.
  count: number;
}

export interface WpPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded: {
    'wp:featuredmedia'?: {
      id: number;
      source_url: string;
      alt_text: string;
    }[];
    'wp:term'?: WpCategory[][];
  };
}
