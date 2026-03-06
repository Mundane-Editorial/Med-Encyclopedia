'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Toggle dark mode"
      className="inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-600 p-1 ring-1 ring-gray-300/80 dark:ring-gray-500/50 shadow-inner"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ease-out ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
        }`}
        aria-label="Light mode"
      >
        <FiSun className="w-[15px] h-[15px]" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ease-out ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
        }`}
        aria-label="Dark mode"
      >
        <FiMoon className="w-[15px] h-[15px]" />
      </button>
    </div>
  );
}
