
import type { WpPost, WpCategory } from '../types';

const API_BASE_URL = 'https://meolamdep.info/wp-json/wp/v2';

interface FetchPostsParams {
  page?: number;
  perPage?: number;
  exclude?: number[];
  search?: string;
}

export const fetchPosts = async ({
  page = 1,
  perPage = 10,
  exclude = [],
  search = '',
}: FetchPostsParams = {}): Promise<WpPost[]> => {
  const params = new URLSearchParams({
    _embed: 'true',
    page: String(page),
    per_page: String(perPage),
  });

  if (exclude.length > 0) {
    params.append('exclude', exclude.join(','));
  }

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`${API_BASE_URL}/posts?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch posts. Status: ${response.status}`);
  }

  const posts: WpPost[] = await response.json();
  return posts;
};

export const fetchCategories = async (): Promise<WpCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/categories?per_page=20`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};
