
import React from 'react';
import type { WpPost } from '../types';

interface PostCardProps {
  post: WpPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/500/300`;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  const postDate = new Date(post.date).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 group">
      <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
        <img src={imageUrl} alt={post.title.rendered} className="w-full h-48 object-cover" />
      </a>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-sm font-semibold text-pink-600">{category}</span>
        </div>
        <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
          <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-pink-700 transition-colors"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          ></h2>
        </a>
        <div className="text-gray-600 text-sm mb-4 flex-grow"
             dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        ></div>
        <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
           <a href={post.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-pink-600 hover:text-pink-800">Đọc thêm &rarr;</a>
          <span>{postDate}</span>
        </div>
      </div>
    </div>
  );
};
