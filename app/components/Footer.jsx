import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} VestiBot. Designed by <a href="https://www.github.com/k-dileep" className="text-gray-400 hover:text-green-700">KD</a>
        </p>
      </div>
    </footer>
  );
} 