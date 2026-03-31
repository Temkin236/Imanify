import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedViewProps {
  onUnauthenticated: () => void;
  children: React.ReactNode;
}

export function ProtectedView({ onUnauthenticated, children }: ProtectedViewProps) {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onUnauthenticated();
    }
  }, [isAuthenticated, loading, onUnauthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}
