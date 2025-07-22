'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);


  const NavLink = ({ href, children, isMobile = false }) => {
    const isActive = pathname === href;
    const baseClasses = 'px-4 py-2 rounded-full transition-colors';
    const mobileClasses = isMobile ? 'block w-full text-left' : '';
    const activeClasses = isActive ? 'bg-green-600 text-white' : 'text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300';
    
    return (
      <Link 
        href={href} 
        className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
      >
        {children}
      </Link>
    );
  };

  // Generate a consistent color based on user's email or name
  const generateColor = (str) => {
    if (!str) return '#10B981'; // Default color
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#4F46E5', // indigo-600
      '#7C3AED', // violet-600
      '#EC4899', // pink-600
      '#10B981', // emerald-600
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#0EA5E9', // sky-500
      '#8B5CF6', // purple-500
      '#14B8A6', // teal-500
      '#F97316', // orange-500
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials from name or email
  const getInitials = () => {
    if (!user) return '';
    
    if (user.displayName) {
      const nameParts = user.displayName.split(' ');
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return user.displayName[0].toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : '';
  };


  const renderProfileAvatar = () => {
    if (!user) return null;

    // Prioritize Firestore profile.photoURL over Auth photoURL
    const photoURL = user.profile?.photoURL || user.photoURL;
    
    if (photoURL && !imageError) {
      // Check if the URL is valid
      let safePhotoURL;
      try {
        // Try to create a URL object to validate it
        const urlObj = new URL(photoURL);
        
        // Ensure the hostname is i.ibb.co (or other valid domains)
        if (urlObj.hostname === 'i.ibb.co') {
          // URL is valid, encode the path portion only
          const pathParts = urlObj.pathname.split('/');
          const lastPart = pathParts[pathParts.length - 1];
          const encodedLastPart = encodeURIComponent(lastPart);
          pathParts[pathParts.length - 1] = encodedLastPart;
          
          // Reconstruct the URL
          urlObj.pathname = pathParts.join('/');
          safePhotoURL = urlObj.toString();
        } else {
          // Not from ImgBB, just use as is
          safePhotoURL = photoURL;
        }
      } catch (error) {
        // If URL parsing fails, try simple encoding
        safePhotoURL = photoURL.includes(' ') ? encodeURI(photoURL) : photoURL;
      }
      
      return (
        <Image
          src={safePhotoURL}
          alt="Profile"
          width={32}
          height={32}
          className="object-contain w-full h-full"
          onError={() => setImageError(true)}
          priority
        />
      );
    }
    
    // Fallback to initials avatar
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: generateColor(user.email || user.displayName || 'user') }}
      >
        <span className="text-xs font-bold text-white">
          {getInitials()}
        </span>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full py-3 px-4 md:px-8 flex justify-between items-center border-b border-gray-200 bg-white dark:bg-gray-800">
        <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="font-poppins font-semibold text-lg text-black dark:text-white">VestiBot</span>
        </Link>
      
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/">Chatbot</NavLink>
          <NavLink href="/products">Products</NavLink>
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink href="/profile">Profile</NavLink>
              <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden ml-2">
                {renderProfileAvatar()}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-[61px] left-0 right-0 z-40 bg-white dark:bg-gray-800 md:hidden border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink href="/" isMobile={true}>Chatbot</NavLink>
            <NavLink href="/products" isMobile={true}>Products</NavLink>
            {user ? (
              <>
                <NavLink href="/profile" isMobile={true}>Profile</NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
} 