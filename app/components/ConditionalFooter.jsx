'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't render footer on the homepage
  if (pathname === '/') {
    return null;
  }

  return <Footer />;
} 