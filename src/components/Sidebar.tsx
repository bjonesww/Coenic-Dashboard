'use client';

import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'upload', label: 'Upload Data', icon: '📤' },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-bold">Corenic</h1>
        <p className="text-sm text-neutral-400">Executive Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === item.id
                ? 'bg-primary-600 text-white'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">
          © 2026 Corenic Construction
        </p>
      </div>
    </aside>
  );
}