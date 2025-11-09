
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-lg font-bold text-pink-400 mb-4 md:mb-0">
            Mẹo Làm Đẹp
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="hover:text-pink-400 transition-colors">Liên hệ</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Về chúng tôi</a>
          </nav>
        </div>
        <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} MeoLamDep.info. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
