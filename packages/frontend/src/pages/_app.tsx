import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth-context'; // AuthProvider'ı import ediyoruz
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
