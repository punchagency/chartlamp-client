"use client";
import { useAuthContext } from '@/auth/useAuthContext';
import LoadingScreen from '@/components/loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const {user, isAuthenticated, isInitialized} = useAuthContext();

  useEffect(() => {
    if (user && !isAuthenticated) {
      router.push('/auth/two-factor');
    }else if (isAuthenticated && user) {
      router.push('/dashboard/home');
    }else if (!isAuthenticated && isInitialized && !user) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, user, isInitialized]);


  return (
      <LoadingScreen/>
  );
}