import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  role?: string;
  abonnement?: string;
}

interface AuthContextType {
  user: UserProfile;
  token: string | null;
  login: (userData: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  id: 1,
  name: 'Sami Commerçant',
  email: 'admin@gmail.com',
  role: 'admin',
  abonnement: 'pro',
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  token: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [token, setToken] = useState<string | null>(null);

  // Charger la session sauvegardée sur web si disponible
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedUser = window.localStorage.getItem('hanoti_user');
        const savedToken = window.localStorage.getItem('hanoti_token');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (e) {
        console.warn('Erreur lors du chargement de la session:', e);
      }
    }
  }, []);

  const login = (userData: UserProfile, userToken: string) => {
    // S'assurer que le nom est défini
    const finalUser = {
      ...userData,
      name: userData.name || userData.email.split('@')[0] || 'Commerçant',
    };
    setUser(finalUser);
    setToken(userToken);

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('hanoti_user', JSON.stringify(finalUser));
        window.localStorage.setItem('hanoti_token', userToken);
      } catch (e) {
        console.warn('Erreur lors de la sauvegarde locale:', e);
      }
    }
  };

  const logout = () => {
    setUser(defaultUser);
    setToken(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('hanoti_user');
        window.localStorage.removeItem('hanoti_token');
      } catch (e) {
        console.warn('Erreur lors du nettoyage de la session:', e);
      }
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('hanoti_user', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
