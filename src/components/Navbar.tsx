
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm py-3">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="font-bold text-2xl heading-gradient">SignScribe</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/about') ? "text-primary" : "text-muted-foreground"
              )}
            >
              About
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/translate" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/translate') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Translate
                </Link>
                <Link 
                  to="/learning" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/learning') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Learning
                </Link>
                <Link 
                  to="/profile" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/profile') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Profile
                </Link>
              </>
            )}
            <Link 
              to="/contact" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/contact') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 shadow-lg animate-slide-in">
          <div className="flex flex-col gap-4">
            <Link 
              to="/" 
              className={cn(
                "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                isActive('/') ? "text-primary" : "text-muted-foreground"
              )}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                isActive('/about') ? "text-primary" : "text-muted-foreground"
              )}
              onClick={closeMenu}
            >
              About
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/translate" 
                  className={cn(
                    "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                    isActive('/translate') ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={closeMenu}
                >
                  Translate
                </Link>
                <Link 
                  to="/learning" 
                  className={cn(
                    "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                    isActive('/learning') ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={closeMenu}
                >
                  Learning
                </Link>
                <Link 
                  to="/profile" 
                  className={cn(
                    "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                    isActive('/profile') ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </>
            )}
            <Link 
              to="/contact" 
              className={cn(
                "px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                isActive('/contact') ? "text-primary" : "text-muted-foreground"
              )}
              onClick={closeMenu}
            >
              Contact
            </Link>
            
            <div className="border-t border-border my-2"></div>
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => { logout(); closeMenu(); }}>
                Log Out
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild onClick={closeMenu}>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild onClick={closeMenu}>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
