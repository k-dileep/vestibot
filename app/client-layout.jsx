'use client';

import './globals.css';
import { Poppins } from 'next/font/google';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConditionalFooter from './components/ConditionalFooter';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});


export default function ClientLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <div className={`flex flex-col h-screen overflow-hidden ${poppins.className} bg-gray-100 dark:bg-gray-900`}>
            <Navbar />
            <ProtectedRoute>
              <main className="flex-grow overflow-y-auto">
                {children}
              </main>
            </ProtectedRoute>
            <ConditionalFooter />
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
} 