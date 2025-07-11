import { StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { Link, useRouter } from 'expo-router';
import LoginButton from '../../components/loginButton';
import LoginForm from '../../components/loginForm';

export default function LoginScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 50 }}>
                <Text style={styles.loginFont}>Login
                    <Text style={styles.loginSub}> to your account.</Text> 
                </Text> 
            </View>
            <View style={{gap: 15}}>
                <LoginForm inputLabel='Email' iconName='envelope' placeholderText='youremail@gmail.com' isPassword={false} />
                <LoginForm inputLabel='Password'  iconName='lock' placeholderText='*************' isPassword={true} />
            </View>
            <View style={{width: 300}}>
                <Link 
                style={styles.ForgotPW} 
                href="./forgot-password">Forgot Password?</Link>
            </View>
            <LoginButton buttonLabel="Login" style={{backgroundColor: '#C6844F'}} 
                textStyle={{color: '#FFFFFF', fontFamily: 'Montserrat_700Bold'}}
                onPress={() => {
                    router.replace("/tabs/");
                }} />
            <View style={{ flexDirection: 'row'}}>
                <Text style={{ fontFamily: 'Montserrat_400Regular', color: '#5C4630' }}>Don't have an account? </Text>
                <Link style={{ fontFamily: 'Montserrat_700Bold' , color: '#3A2A21' , textDecorationLine: 'underline'}} href="./register">Register</Link>
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
  }
});
