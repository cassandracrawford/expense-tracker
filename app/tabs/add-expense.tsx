<<<<<<< Updated upstream
import { StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
=======
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
>>>>>>> Stashed changes
import { useRouter } from 'expo-router';
import supabase from '@/lib/supabase';

export default function AddExpenseScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

<<<<<<< Updated upstream
    return (
=======
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [recurrenceItems, setRecurrenceItems] = useState([
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Bi-Weekly', value: 'Bi-Weekly' },
    { label: 'Semi-Monthly', value: 'Semi-Monthly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]);

  const handleSaveExpense = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
  .from('transactions')
  .insert([{
    amount: parseFloat(amount),
    date: date.toISOString(),
    description,
    category: categoryValue,
    payment_method: sourceValue,
    type: 'expense',
    is_recurring: true,
    recurrence_frequency: recurrence,
    user_id: user?.id, 
  }]);

  if (error) {
    console.error('Supabase insert error:', error);
    Alert.alert('Error', 'Failed to save expense');
  } else {
    Alert.alert('Expense saved!', '', [
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
            <Text>Add Expense</Text>
        </View>
<<<<<<< Updated upstream
    );
=======
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
>>>>>>> Stashed changes
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
