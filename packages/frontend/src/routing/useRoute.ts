import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/context/auth-context';

interface RouteOptions {
  redirect: {
    onCondition: boolean;
    toDefaultAuthenticatedPath?: boolean;
  };
}

export const useRoute = (options: RouteOptions) => {
  const router = useRouter();
  const { userId } = useAuthContext();

  useEffect(() => {
    if (options && options.redirect.onCondition && userId) {
      if (options.redirect.toDefaultAuthenticatedPath) {
        router.push('/'); // Varsayılan yönlendirme yolu
      }
    }

    if (options && !options.redirect.onCondition && !userId) {
      router.push('/sign-in'); // Giriş yapmamış kullanıcıyı sign-in sayfasına yönlendiriyoruz
    }
  }, [userId, options, router]);
};
