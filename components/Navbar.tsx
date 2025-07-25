import React from 'react';
import MiningIcon from './icons/MiningIcon';

interface NavbarProps {
  onAdminLoginClick: () => void;
  onLogoClick: () => void;
  isUserLoggedIn: boolean;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminLoginClick, onLogoClick, isUserLoggedIn, onLogoutClick }) => {
  return (
    <header className="bg-white shadow-md z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onLogoClick} className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary rounded-md p-1">
              <MiningIcon className="h-8 w-auto text-brand-secondary" />
              <span className="font-bold text-brand-dark text-lg hidden sm:block">Mines and Minerals Laws Ecosystem</span>
            </button>
          </div>
          <div className="flex items-center">
            {!isUserLoggedIn && (
              <button
                onClick={onAdminLoginClick}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-secondary bg-brand-light hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
              >
                Admin Login
              </button>
            )}
            {isUserLoggedIn && (
              <button
                onClick={onLogoutClick}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-secondary bg-brand-light hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;