import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useFonts as useCodystarFonts, Codystar_400Regular } from '@expo-google-fonts/codystar';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import LoginButton from '../components/loginButton';
import { useRouter } from 'expo-router';
import supabase from '../lib/supabase';
import { useEffect } from 'react';

export default function App() {
  const [codystarLoaded] = useCodystarFonts({ Codystar_400Regular });
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });

  const router = useRouter();

  useEffect(() => {
    const ensureUserRowExists = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        console.warn('⚠️ No auth user found.');
        return;
      }

      const { id, email, user_metadata } = user;
      const fullName = user_metadata?.full_name || 'User';

      // 查是否已存在
      const { data: existing, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Failed to check users table:', fetchError.message);
        return;
      }

      if (!existing) {
        console.log('🚧 No user row found, inserting...');
        const { error: insertError } = await supabase.from('users').insert([{
          id,
          full_name: fullName,
          email,
          currency: 'USD',
          language: 'en'
        }]);

        if (insertError) {
          console.error('❌ Failed to insert user row:', insertError.message);
        } else {
          console.log('✅ User row inserted successfully');
        }
      } else {
        console.log('✅ User row already exists');
      }
    };

    ensureUserRowExists();
  }, []);

  if (!codystarLoaded || !montserratLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.circle}></View>
      <View style={styles.main}>
        <Text style={styles.title}>Penny</Text>
        <Text style={styles.title}>Planner</Text>
        <Text style={[styles.subtitle, { marginBottom: 100 }]}>Track your money to the last penny.</Text>

        <LoginButton
          buttonLabel="Login"
          style={{ backgroundColor: '#C6844F' }}
          textStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat_700Bold' }}
          onPress={() => router.push('/auth/login')}
        />
        <LoginButton
          buttonLabel="Sign Up"
          style={{ borderWidth: 2, borderColor: '#C6844F' }}
          textStyle={{ color: '#C6844F', fontFamily: 'Montserrat_700Bold' }}
          onPress={() => router.push('/auth/register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C6844F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: '#FFF8F2',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#3A2A21',
    fontSize: 64,
    fontFamily: 'Codystar_400Regular',
    maxWidth: 400,
    zIndex: 1,
  },
  subtitle: {
    color: '#5C4630',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
  },
});
