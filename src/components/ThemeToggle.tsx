
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative overflow-hidden w-10 h-10 rounded-full ${className}`}
      aria-label="Toggle theme"
    >
      <Sun className={`absolute h-5 w-5 transition-all duration-300 ${
        theme === 'dark' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
      }`} />
      <Moon className={`absolute h-5 w-5 transition-all duration-300 ${
        theme === 'light' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
      }`} />
    </Button>
  );
};

export default ThemeToggle;
