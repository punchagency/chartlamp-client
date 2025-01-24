import LoadingScreen from '@/components/loading';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!isAuthenticated && !isLoading) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = "/auth/signin";
      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}