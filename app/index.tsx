import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useFonts as useCodystarFonts, Codystar_400Regular } from '@expo-google-fonts/codystar';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import LoginButton from '../components/loginButton';
import { useRouter } from 'expo-router';
import supabase from '../lib/supabase';



export default function App() {
  const [codystarLoaded] = useCodystarFonts({ Codystar_400Regular });
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });

  const router = useRouter();

  if (!codystarLoaded || !montserratLoaded) {
    return null;
  }

  const handleTestConnection = async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      Alert.alert('❌ Supabase Error', error.message);
    } else {
      Alert.alert('✅ Supabase Connected', `Pulled ${data.length} user(s)`);
      console.log(data);
    }
  };

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

        {/* ✅ Supabase connection test */}
        {/* <View style={{ marginTop: 40 }}>
          <Button title="Test Supabase Connection" onPress={handleTestConnection} />
        </View> */}
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
