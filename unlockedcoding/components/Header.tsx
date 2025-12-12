import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout, isReady } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="bg-white dark:bg-black text-black dark:text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 text-2xl font-bold text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
            <Image 
              src="/images.png" 
              alt="UnlockedCoding Logo" 
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
              priority
            />
            <span>{(siteName || 'Unlocked Coding').toUpperCase()}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
                Home
              </Link>
              <Link href="/r" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
                Categories
              </Link>
              <Link href="/all" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
                All Courses
              </Link>
              <Link href="/about" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
                About
              </Link>
            </nav>
            <ThemeToggle />
            {isReady && (
              user ? (
                <div className="flex items-center space-x-3">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-black dark:text-white leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={logout}
                      className="text-xs text-foreground hover:underline text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className="bg-foreground hover:opacity-90 text-background px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
                >
                  Login with Google
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="text-black dark:text-white hover:opacity-70 transition-colors duration-200 p-2"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link 
                href="/" 
                className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200 py-2"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/r" 
                className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200 py-2"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link 
                href="/all" 
                className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200 py-2"
                onClick={closeMobileMenu}
              >
                All Courses
              </Link>
              <Link 
                href="/about" 
                className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200 py-2"
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </nav>
            {isReady && (
              <div className="mt-4">
                {user ? (
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {user.picture ? (
                        <Image
                          src={user.picture}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-base font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-black dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="text-sm text-foreground hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      login();
                      closeMobileMenu();
                    }}
                    className="w-full bg-foreground hover:opacity-90 text-background px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
                  >
                    Login with Google
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
