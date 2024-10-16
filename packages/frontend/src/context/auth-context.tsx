import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import axiosClient from '@/utils/axiosClient';

interface AuthContextProps {
  userId: number | null; // Kullanıcı ID'sini ekleyin
  setUserId: (id: number | null) => void; // Kullanıcı ID'sini ayarlamak için fonksiyon
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null); // Kullanıcı ID'sini saklamak için state
  const [isFetched, setIsFetched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get('/auth/me', {
          withCredentials: true, // Cookie'leri göndermek için bu ayarı ekliyoruz
        });
        setUserId(response.data.id); // Kullanıcı ID'sini ayarla
        setIsFetched(true); // Kullanıcı bilgileri alındı
      } catch (error) {
        console.error('User authentication failed:', error); // Hata logu
        setUserId(null);
        router.push('/sign-in'); // Kullanıcıyı sign-in sayfasına yönlendir
      }
    };

    // Eğer kullanıcı bilgileri mevcut değilse ve henüz fetch edilmediyse fetchUser'ı çağır
    if (!isFetched) {
      fetchUser();
    }
  }, []); // user state'ini bağımlılık olarak ekleyin

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
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
