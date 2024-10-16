import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth-context'; // AuthProvider'ı import ediyoruz
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { UserActions } from '@/components/user-actions';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserActions />
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
