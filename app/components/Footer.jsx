import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900">
      {/* <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4">VestiBot</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            Your AI-powered fashion assistant helping you discover your perfect style.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/chatbot" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Chatbot
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Connect</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div> */}
      
      <div className="max-w-7xl mx-auto py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} VestiBot. Designed by <a href="https://www.github.com/k-dileep" className="text-gray-400 hover:text-green-700">KD</a>
        </p>
      </div>
    </footer>
  );
} 