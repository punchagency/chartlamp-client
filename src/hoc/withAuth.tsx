// src/hoc/withAuth.tsx
import { useAuthContext } from '@/auth/useAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { user, isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/auth/signin');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      // return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;