export const metadata = {
  title: 'VestiBot',
  description: 'Your AI Health Assistant',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.svg'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'VestiBot',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  themeColor: '#10B981', // Green color to match your theme
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}; 