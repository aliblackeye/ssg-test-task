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
  const { user } = useAuthContext();

  useEffect(() => {
    if (options && options.redirect.onCondition && user?.id) {
      if (options.redirect.toDefaultAuthenticatedPath) {
        router.push('/'); // Varsayılan yönlendirme yolu
      }
    }

    if (
      options &&
      !options.redirect.onCondition &&
      !user?.id &&
      router.pathname !== '/sign-up' &&
      router.pathname !== '/sign-in' // sign-in sayfasına yönlendirmeyi engelle
    ) {
      router.push('/sign-in'); // Giriş yapmamış kullanıcıyı sign-in sayfasına yönlendiriyoruz
    }
  }, [user?.id, options, router]);
};
