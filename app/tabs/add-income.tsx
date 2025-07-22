import { StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';

export default function AddIncomeScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

<<<<<<< Updated upstream
    return (
=======
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceValue, setSourceValue] = useState(null);
  const [sourceItems, setSourceItems] = useState([
    { label: 'Cash', value: 'Cash' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'PayPal', value: 'PayPal' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Employer', value: 'Employer' },
  ]);

  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [recurrenceItems, setRecurrenceItems] = useState([
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Bi-Weekly', value: 'Bi-Weekly' },
    { label: 'Semi-Monthly', value: 'Semi-Monthly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]);
const handleSaveIncome = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(); 

  if (userError || !user) {
    console.error('User fetch error:', userError);
    Alert.alert('Error', 'Failed to fetch user data');
    return;
  }

  const { error } = await supabase
    .from('transactions')
    .insert([{
      amount: parseFloat(amount),
      date: date.toISOString(),
      description,
      category: categoryValue,
      payment_method: sourceValue,
      type: 'income',
      is_recurring: true,
      recurrence_frequency: recurrence,
      user_id: user.id, 
    }]);

  if (error) {
    console.error('Supabase insert error:', error);
    Alert.alert('Error', 'Failed to save income');
  } else {
    Alert.alert('Income saved!', '', [
      { text: 'OK', onPress: () => router.replace('/tabs') }
    ]);
  }
};


  return (
    <SafeAreaView style={styles.scroll}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
>>>>>>> Stashed changes
        <View style={styles.container}>
            <Text>Add Income</Text>
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
});
