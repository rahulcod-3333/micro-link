import { useEffect } from 'react';
import { hasToken } from '../lib/auth';

export default function AuthGate() {
  useEffect(() => {
    if (!hasToken()) {
      window.location.replace('/login');
    }
  }, []);

  return null;
}
