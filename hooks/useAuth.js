"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState({
    displayName: 'Local User',
    email: 'user@local.dev',
    isSignedIn: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication functions
  const signIn = async (email, password) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      displayName: 'Local User',
      email: email || 'user@local.dev',
      isSignedIn: true
    });
    setIsLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser({
      displayName: null,
      email: null,
      isSignedIn: false
    });
    setIsLoading(false);
    
    // 로그아웃 후 메인 페이지로 리다이렉트
    router.push('/');
  };

  const signUp = async (email, password, displayName) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      displayName: displayName || 'Local User',
      email: email || 'user@local.dev',
      isSignedIn: true
    });
    setIsLoading(false);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signOut, 
      signUp,
      isSignedIn: user?.isSignedIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock Stack Auth hooks for compatibility
export function useUser() {
  const { user } = useAuth();
  return user?.isSignedIn ? user : null;
}