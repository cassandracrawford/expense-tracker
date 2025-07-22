import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import supabase from '@/lib/supabase';
import { Text, View, ActivityIndicator, Alert } from 'react-native'; // Import necessary components

export default function AuthCallback() {
  const router = useRouter();
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    type?: string;
    code?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false); // New state

  useEffect(() => {
    async function handleSession() {
      if (!access_token || !refresh_token) {
        console.warn('AuthCallback: Missing access_token or refresh_token in URL params.');
        setError('Authentication information missing. Please try again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setShowConfirmationMessage(false); // Reset in case of re-run

      try {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: String(access_token),
          refresh_token: String(refresh_token),
        });

        if (sessionError) {
          console.error('AuthCallback: Error setting session:', sessionError.message);
          setError(`Failed to authenticate: ${sessionError.message}`);
          Alert.alert('Authentication Error', `Could not set user session: ${sessionError.message}`);
          router.replace('/login'); // Redirect to login on error
        } else {
          console.log('AuthCallback: Session set successfully.');
          setShowConfirmationMessage(true); // Set state to show confirmation message
          // Delay the final redirect to allow user to see the message
          setTimeout(() => {
            console.log('AuthCallback: Redirecting to / after confirmation message.');
            router.replace('/');
          }, 3000); // Show message for 3 seconds (adjust as needed)
        }
      } catch (e: any) {
        console.error('AuthCallback: Unexpected error during session handling:', e.message);
        setError(`An unexpected error occurred: ${e.message}`);
        Alert.alert('Error', `An unexpected error occurred: ${e.message}`);
        router.replace('/login'); // Fallback on unexpected error
      } finally {
        setLoading(false);
      }
    }

    if (access_token && refresh_token) {
      handleSession();
    } else {
      setLoading(false);
    }

  }, [access_token, refresh_token, router]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10, fontSize: 18 }}>Confirming your account...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center', fontSize: 18, marginBottom: 10 }}>{error}</Text>
        <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => router.replace('/login')}>
          Go to Login
        </Text>
      </View>
    );
  }

  if (showConfirmationMessage) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'green' }}>
          Email Confirmed!
        </Text>
        <Text style={{ marginTop: 10, fontSize: 16 }}>
          You will be redirected shortly.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>
        Processing authentication...
      </Text>
      <Text style={{ marginTop: 10 }} onPress={() => router.replace('/login')}>
        Go to Login
      </Text>
    </View>
  );
}