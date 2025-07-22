import ClientLayout from './client-layout';
import { metadata } from './metadata';

export { metadata };

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
