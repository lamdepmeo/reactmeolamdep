
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleToggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    if(isSearchVisible) { // when closing
        setQuery('');
        onSearch('');
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-pink-600">
            <a href="/">Mẹo Làm Đẹp</a>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Trang Chủ</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Review Mỹ Phẩm</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Chăm Sóc Da</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Makeup</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Liên hệ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleSearch}
              className="text-gray-600 hover:text-pink-600 transition-colors"
              aria-label="Toggle Search"
            >
              <SearchIcon />
            </button>
            <div className={`absolute top-full right-0 mt-2 transition-all duration-300 ease-in-out container mx-auto px-4 ${isSearchVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full p-3 border border-gray-300 rounded-md shadow-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
