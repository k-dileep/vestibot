'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // If auth is not loading and there's no user, we should show the modal.
    if (!loading && !user) {
      setShowAuthModal(true);
    }
    // If the user logs in, the modal should close automatically.
    if (!loading && user) {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  // While checking for authentication, show a loading spinner.
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is a user, render the children components (the actual page).
  if (user) {
    return <>{children}</>;
  }

  // If there's no user and we are done loading, show the auth modal.
  // The children are not rendered, effectively blocking access to the site.
  return (
    <AuthModal
      isOpen={true} // The modal is always open if there's no user
      onClose={() => {
        // The modal should not be closable in a way that allows site access.
        // If the user closes it, they should ideally be prompted again.
        // For now, we do nothing, which will keep the modal overlay active.
      }}
    />
  );
} 