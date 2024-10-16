import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default path (e.g., the homepage)
    router.replace('/sign-in');
  }, [router]);

  return null;
};

export default Custom404;
