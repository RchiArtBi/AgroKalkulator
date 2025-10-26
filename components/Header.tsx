import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-green-600">Agro</span>Kalkulator
            </h1>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Otwórz menu"
            aria-expanded={isMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onAdminClick();
                  // FIX: Corrected typo from `setIsMenu-Open` to `setIsMenuOpen` to fix compilation errors.
                  setIsMenuOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-500 hover:text-white"
              >
                Panel Admina
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
