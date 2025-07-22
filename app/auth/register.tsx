import { View, Text, StyleSheet } from "react-native";
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import LoginButton from '../../components/loginButton';
import LoginForm from '../../components/loginForm';


export default function RegisterScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold})

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
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
          emailRedirectTo: 'expense-tracker://auth/callback',
          data: {
            full_name: trimmedName, 
          },
        },
      });

      if (error) {
        console.error('Sign Up Error:', error.message);
        Alert.alert('Registration Error', error.message);
        return;
      }

      
      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ 
            id: userId, 
            full_name: trimmedName,
            email: trimmedEmail, });

        if (insertError) {
          console.error('Error inserting into users table:', insertError.message);
        }
      }

      Alert.alert(
        'Success!',
        'Check your email to confirm your account.',
        [{ text: 'OK', onPress: () => router.replace('/tabs') }]
      );
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      Alert.alert('Error', 'Something went wrong during registration.');
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
    return(
        <View style={styles.container}>
            <View style={{marginBottom: 50}}>
                <Text style={styles.title}>Create</Text>
                <Text style={styles.title}>Account.</Text>
            </View>
            <View style={{gap: 15, marginBottom: 50}}>
                <LoginForm inputLabel='Name' iconName='user' placeholderText='Your Name' isPassword={false} />
                <LoginForm inputLabel='Email' iconName='envelope' placeholderText='youremail@gmail.com' isPassword={false} />
                <LoginForm inputLabel='Password'  iconName='lock' placeholderText='*************' isPassword={true} />
                <LoginForm inputLabel='Confirm Password'  iconName='lock' placeholderText='*************' isPassword={true} />
            </View>
            <LoginButton buttonLabel="Sign up" style={{backgroundColor: '#C6844F'}} 
                textStyle={{color: '#FFFFFF', fontFamily: 'Montserrat_700Bold'}}
                onPress={() => {
                    router.replace("/tabs/");
                }} />
            <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.text}>or</Text>
                <View style={styles.line}/>
            </View>
            <LoginButton buttonLabel="Login" style={{borderWidth: 2, borderColor: '#C6844F'}} 
                textStyle={{color: '#C6844F', fontFamily: 'Montserrat_700Bold'}}
                onPress={() => {
                    router.push("./login");
                }} />
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
    backgroundColor: '#C6844F'
  },
  text: {
    color: '#C6844F',
    marginHorizontal: 10,
    fontFamily: 'Montserrat_400Regular',
  },
})