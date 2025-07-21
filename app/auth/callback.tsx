import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import supabase from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();

  useEffect(() => {
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token: String(access_token),
          refresh_token: String(refresh_token),
        })
        .then(() => {
          router.replace('/');
        });
    }
  }, [access_token, refresh_token]);

  return null;
}
