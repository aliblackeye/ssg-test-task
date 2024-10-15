import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth-context'; // AuthProvider'ı import ediyoruz
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
