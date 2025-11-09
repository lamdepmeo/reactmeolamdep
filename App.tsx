

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FeaturedSlider } from './components/FeaturedSlider';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { BackToTopButton } from './components/BackToTopButton';
import { Spinner } from './components/Spinner';
import { fetchPosts } from './services/wordpress';
import type { WpPost } from './types';

const App: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<WpPost[]>([]);
  const [mainPosts, setMainPosts] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WpPost[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver>();

  const loadMainPosts = useCallback(async (currentPage: number, excludeIds: number[]) => {
    setLoadingMore(true);
    try {
      const newPosts = await fetchPosts({ page: currentPage, perPage: 10, exclude: excludeIds });
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setMainPosts(prev => [...prev, ...newPosts]);
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError('Failed to load more posts.');
    } finally {
      setLoadingMore(false);
    }
    // Fix: The dependency array for useCallback is set to empty because this function doesn't depend on any props or state values.
    // State setters from useState are guaranteed to be stable and don't need to be included.
  }, []);

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        loadMainPosts(page, featuredPosts.map(p => p.id));
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, page, loadMainPosts, featuredPosts, searchQuery]);

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        const featured = await fetchPosts({ page: 1, perPage: 5 });
        setFeaturedPosts(featured);
        const featuredIds = featured.map(p => p.id);
        
        const main = await fetchPosts({ page: 1, perPage: 10, exclude: featuredIds });
        setMainPosts(main);
        setPage(2);
        if (main.length < 10) {
          setHasMore(false);
        }
      } catch (err) {
        setError('Failed to fetch initial posts. Please check your connection or the WordPress API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const results = await fetchPosts({ search: query });
      setSearchResults(results);
    } catch (err) {
      setError('Failed to perform search.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const postsToDisplay = searchQuery ? searchResults : mainPosts;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        {!searchQuery && <FeaturedSlider posts={featuredPosts} loading={loading} />}

        <div className="mt-12">
          {searchQuery && (
            <h1 className="text-3xl font-bold mb-8">Search Results for: "{searchQuery}"</h1>
          )}
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/3">
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <Spinner />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {postsToDisplay.length > 0 ? (
                    postsToDisplay.map((post, index) => {
                      if (postsToDisplay.length === index + 1) {
                        return <div ref={lastPostElementRef} key={post.id}><PostCard post={post} /></div>;
                      }
                      return <PostCard key={post.id} post={post} />;
                    })
                  ) : (
                    <p className="md:col-span-2 text-center text-gray-500">
                      {isSearching ? 'Searching...' : 'No posts found.'}
                    </p>
                  )}
                </div>
              )}
              {loadingMore && <div className="flex justify-center py-8"><Spinner /></div>}
            </div>
            <div className="w-full lg:w-1/3">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default App;