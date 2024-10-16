import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import axiosClient from '@/utils/axiosClient';

interface AuthContextProps {
  user?: any; // Kullanıcı ID'sini ekleyin
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<number | null>(null); // Kullanıcı ID'sini saklamak için state
  const [isFetched, setIsFetched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get('/auth/me', {
          withCredentials: true, // Cookie'leri göndermek için bu ayarı ekliyoruz
        });
        setUser(response.data); // Kullanıcı ID'sini ayarla
        setIsFetched(true); // Kullanıcı bilgileri alındı
      } catch (error) {
        console.error('User authentication failed:', error); // Hata logu
        setUser(null);
        router.replace('/sign-in');
      }
    };

    // Eğer kullanıcı bilgileri mevcut değilse ve henüz fetch edilmediyse fetchUser'ı çağır
    if (!isFetched && !user) {
      fetchUser();
    }
  }, []); // user state'ini bağımlılık olarak ekleyin

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
