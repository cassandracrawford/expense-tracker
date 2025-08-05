import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import LoginButton from '../../components/loginButton';
import LoginForm from '../../components/loginForm';
import { useState } from 'react';
import * as Linking from 'expo-linking'
import supabase from '../../lib/supabase';

export default function RegisterScreen() {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });
  const [opensansLoaded] = useOpenSansFonts({ OpenSans_400Regular, OpenSans_700Bold });
  const redirectUrl = Linking.createURL('/auth/callback');

  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!montserratLoaded || !opensansLoaded) return null;

  const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  };

  if (isSubmitting) return;

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        console.error('Sign Up Error:', error.message);
        Alert.alert('Registration Error', 'Could not sign you up. Please check your email or try again later.');
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking if user exists:', fetchError.message);
      } else if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ id: userId, full_name: trimmedName, email: trimmedEmail });

        if (insertError) {
          console.error('Error inserting into users table:', insertError.message);
        }
      } else {
          console.log('User already exists in users table.');
      }}

      Alert.alert(
        'Success!',
        'Check your email to confirm your account.',
        [{ text: 'OK', onPress: () => { 
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }}]
      );

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Unexpected Error:', message);
      Alert.alert('Error', message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text style={styles.title}>Create</Text>
        <Text style={styles.title}>Account.</Text>
      </View>

      <View style={{ gap: 15, marginBottom: 50 }}>
        <LoginForm inputLabel="Name" iconName="user" placeholderText="Your Name" isPassword={false} value={name} onChangeText={setName} />
        <LoginForm inputLabel="Email" iconName="envelope" placeholderText="youremail@gmail.com" isPassword={false} value={email} onChangeText={setEmail} />
        <LoginForm inputLabel="Password" iconName="lock" placeholderText="*************" isPassword={true} value={password} onChangeText={setPassword} />
        <LoginForm inputLabel="Confirm Password" iconName="lock" placeholderText="*************" isPassword={true} value={confirmPassword} onChangeText={setConfirmPassword} />
      </View>

      <LoginButton
        buttonLabel={isSubmitting ? 'Signing up...' : 'Sign up'}
        style={{ backgroundColor: '#C6844F', opacity: isSubmitting ? 0.6 : 1 }}
        textStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat_700Bold' }}
        onPress={handleRegister}
      />

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.text}>or</Text>
        <View style={styles.line} />
      </View>

      <LoginButton
        buttonLabel="Login"
        style={{ borderWidth: 2, borderColor: '#C6844F' }}
        textStyle={{ color: '#C6844F', fontFamily: 'Montserrat_700Bold' }}
        onPress={() => router.push('./login')}
      />
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
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'OpenSans_700Bold',
    letterSpacing: 2,
  },
  separator: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C6844F',
  },
  text: {
    color: '#C6844F',
    marginHorizontal: 10,
    fontFamily: 'Montserrat_400Regular',
  },
});