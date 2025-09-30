import React, { useState } from 'react';
import { Camera, MapPin, Plus, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthState, PageType } from '@/lib/types';

interface NavbarProps {
  authState: AuthState;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ authState, currentPage, onNavigate, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate(authState.isAuthenticated ? 'articles' : 'landing')}
          >
            <Camera className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TravelExplore
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {authState.isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => onNavigate('articles')}>
                  <MapPin className="w-4 h-4" />
                  Destinations
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('create-article')}>
                  <Plus className="w-4 h-4" />
                  Create Article
                </Button>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{authState.user?.username}</p>
                    <p className="text-xs text-gray-500">{authState.user?.email}</p>
                  </div>
                  <Button variant="danger" onClick={onLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
                <Button variant="primary" onClick={() => onNavigate('register')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {authState.isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => { onNavigate('articles'); setMobileMenuOpen(false); }} 
                  className="w-full mb-2"
                >
                  Destinations
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => { onNavigate('create-article'); setMobileMenuOpen(false); }} 
                  className="w-full mb-2"
                >
                  Create Article
                </Button>
                <div className="p-4 bg-gray-50 rounded-xl mb-2">
                  <p className="font-semibold">{authState.user?.username}</p>
                  <p className="text-sm text-gray-500">{authState.user?.email}</p>
                </div>
                <Button 
                  variant="danger" 
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }} 
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} 
                  className="w-full mb-2"
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} 
                  className="w-full"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};  