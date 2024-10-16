import { FunctionComponent, PropsWithChildren } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { useRoute } from '@/routing/useRoute';
import { SignIn } from '@/components/sign-in';

type Props = {};

export const AppSignInView: FunctionComponent<
  PropsWithChildren<Props>
> = ({}) => {
  const { user } = useAuthContext();

  useRoute({
    redirect: {
      onCondition: !!user,
      toDefaultAuthenticatedPath: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
      <SignIn />
    </div>
  );
};
