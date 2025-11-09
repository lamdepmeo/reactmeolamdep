
import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchPosts } from '../services/wordpress';
import type { WpCategory, WpPost } from '../types';

export const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<WpCategory[]>([]);
  const [popularPosts, setPopularPosts] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, posts] = await Promise.all([
          fetchCategories(),
          fetchPosts({ perPage: 5 }), // Using latest as "popular" for now
        ]);
        setCategories(cats.filter(c => c.count > 0)); // Filter out empty categories
        setPopularPosts(posts);
      } catch (error) {
        console.error("Failed to load sidebar data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                     <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <aside className="sticky top-24 space-y-8">
      {/* Popular Posts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Bài viết nổi bật</h3>
        <ul className="space-y-4">
          {popularPosts.map(post => (
            <li key={post.id} className="flex items-start space-x-3">
              <img 
                src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/100/100`}
                alt={post.title.rendered}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-pink-600 transition-colors"
                   dangerouslySetInnerHTML={{ __html: post.title.rendered }}>
                </a>
                <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('vi-VN')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Chuyên mục</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id}>
              <a href={category.link} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center text-gray-700 hover:text-pink-600 transition-colors">
                <span dangerouslySetInnerHTML={{ __html: category.name }}></span>
                <span>&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
