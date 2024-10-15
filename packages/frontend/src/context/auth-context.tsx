import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
  isPlatformAdmin: boolean;
  setIsPlatformAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState<boolean>(false); // admin bilgisi

  return (
    <AuthContext.Provider
      value={{ user, setUser, isPlatformAdmin, setIsPlatformAdmin }}
    >
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
