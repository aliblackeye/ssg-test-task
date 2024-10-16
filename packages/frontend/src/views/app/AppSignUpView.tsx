import { FunctionComponent, PropsWithChildren } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { useRoute } from '@/routing/useRoute';
import { SignUp } from '@/components/sign-up';

type Props = {};

export const AppSignUpView: FunctionComponent<
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-4">Create an account</h2>
      <SignUp />
    </div>
  );
};
