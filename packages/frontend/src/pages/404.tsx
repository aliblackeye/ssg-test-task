import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PUBLIC_WEBSITE_ROUTES } from '@/routing/routes';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default path (e.g., the homepage)
    router.replace(PUBLIC_WEBSITE_ROUTES.getDefaultPath());
  }, [router]);

  return null;
};

export default Custom404;
