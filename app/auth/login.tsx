import { StyleSheet, Text, View, Alert } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { Link, useRouter } from 'expo-router';
import LoginButton from '../../components/loginButton';
import LoginForm from '../../components/loginForm';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });
  const [opensansLoaded] = useOpenSansFonts({ OpenSans_400Regular, OpenSans_700Bold });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  if (!montserratLoaded || !opensansLoaded) {
    return null;
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      // 🔍 Optional: debug session confirmation
      const sessionResult = await supabase.auth.getSession();
      console.log('🟢 Session after login:', sessionResult.data.session);

      if (!sessionResult.data.session) {
        Alert.alert('Warning', 'Login successful but no session detected.');
      }

      // ✅ Go to dashboard/tabs
      router.replace('/tabs/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text style={styles.loginFont}>
          Login<Text style={styles.loginSub}> to your account.</Text>
        </Text>
      </View>

      <View style={{ gap: 15 }}>
        <LoginForm
          inputLabel="Email"
          iconName="envelope"
          placeholderText="youremail@gmail.com"
          isPassword={false}
          value={email}
          onChangeText={setEmail}
        />
        <LoginForm
          inputLabel="Password"
          iconName="lock"
          placeholderText="*************"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={{ width: 300 }}>
        <Link style={styles.ForgotPW} href="./forgot-password">
          Forgot Password?
        </Link>
      </View>

      <LoginButton
        buttonLabel="Login"
        style={{ backgroundColor: '#C6844F' }}
        textStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat_700Bold' }}
        onPress={handleLogin}
      />

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: '#5C4630' }}>
          Don't have an account?{' '}
        </Text>
        <Link
          style={{ fontFamily: 'Montserrat_700Bold', color: '#3A2A21', textDecorationLine: 'underline' }}
          href="./register"
        >
          Register
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginFont: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 40,
    letterSpacing: 3,
    color: '#3A2A21',
  },
  loginSub: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 20,
    color: '#5C4630',
    letterSpacing: 1,
  },
  ForgotPW: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#5C4630',
    marginBottom: 30,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});
