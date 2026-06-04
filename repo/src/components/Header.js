import React from 'react';
import { Palette, Building2, Shield } from 'lucide-react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-3 rounded-xl shadow-inner">
              <Palette size={32} className="text-amber-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif tracking-wide">
                古建彩画修复色谱纪要系统
              </h1>
              <p className="text-amber-200 text-sm mt-1">
                建筑遗产保护 · 专家论证会数字化记录平台
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-2 rounded-lg">
              <Building2 size={18} className="text-amber-300" />
              <span className="text-sm">文物保护单位</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-2 rounded-lg">
              <Shield size={18} className="text-amber-300" />
              <span className="text-sm">专业认证</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
    </header>
  );
}

export default Header;
