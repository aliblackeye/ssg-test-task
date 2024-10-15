import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/context/auth-context';

interface RouteOptions {
  redirect: {
    onCondition: boolean;
    toDefaultAuthenticatedPath?: boolean;
  };
}

export const useRoute = (routes: any, options: RouteOptions) => {
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (options.redirect.onCondition && user) {
      router.push('/tasks'); // Giriş yapmış kullanıcıyı tasks sayfasına yönlendiriyoruz
    }
  }, [user, options.redirect.onCondition, router]);
};
