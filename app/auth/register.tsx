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