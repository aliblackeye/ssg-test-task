import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/router';
import { Button } from './ui/button';

export const UserActions = () => {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    setUser(undefined);
    // API çağrısı ile cookie'yi sil
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Cookie'leri göndermek için
    });

    router.push('/sign-in');
  };

  return (
    <div className="flex justify-end p-4 fixed top-0 right-0 z-50">
      <div className="flex items-end flex-col gap-3">
        <p className="text-lg text-gray-500 font-bold">{user?.fullname}</p>
        <p className="text-lg text-gray-500 font-bold">{user?.email}</p>

        {user?.id && (
          <Button variant={'destructive'} onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};
