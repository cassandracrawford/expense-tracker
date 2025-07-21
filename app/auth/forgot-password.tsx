import { StyleSheet, Text, View, Alert } from "react-native";
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import LoginButton from "../../components/loginButton";
import LoginForm from "../../components/loginForm";
import { Link } from "expo-router";
import { useState } from "react";
import supabase from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });
  const [opensansLoaded] = useOpenSansFonts({ OpenSans_400Regular, OpenSans_700Bold });

  if (!montserratLoaded || !opensansLoaded) {
    return null;
  }

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEmailSent(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: 310, marginBottom: 30 }}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset your password</Text>
      </View>
      <View style={{ width: 310, marginBottom: 30 }}>
        <LoginForm
          inputLabel="Email"
          iconName="envelope"
          placeholderText="youremail@gmail.com"
          isPassword={false}
          value={email}
          onChangeText={setEmail}
        />
        {emailSent && (
          <Text style={styles.resetMessageText}>
            Reset password link has been sent to your email.
          </Text>
        )}
      </View>
      <LoginButton
        buttonLabel="Reset Password"
        style={{ backgroundColor: '#C6844F' }}
        textStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat_700Bold' }}
        onPress={handleResetPassword}
      />
      <Link style={styles.loginText} href="./login">Back to Login</Link>
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
    fontFamily: 'OpenSans_700Bold',
    fontSize: 28,
    color: '#3A2A21',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#5C4630',
  },
  resetMessageText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    marginTop: 5,
    color: '#C6844F',
    textAlign: 'center',
  },
  loginText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#5C4630',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
