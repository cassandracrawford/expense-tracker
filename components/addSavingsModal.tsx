import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import supabase from '../lib/supabase';

interface SavingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveComplete?: () => void;
}

export default function SavingsModal({ visible, onClose, onSaveComplete }: SavingsModalProps) {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium });

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startAmount, setStartAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState('Monthly');
  const [frequencyItems, setFrequencyItems] = useState([
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'Bi-Weekly' },
    { label: 'Monthly', value: 'Monthly' },
  ]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) setDate(selectedDate);
      setShowPicker(false);
    } else if (Platform.OS === 'ios' && selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return Alert.alert('User not logged in');

    if (!goalName || !targetAmount) return Alert.alert('Missing info', 'Goal name and target amount are required.');

    const { error } = await supabase.from('goals').insert([{
      user_id: userId,
      name: goalName,
      target_amount: parseFloat(targetAmount),
      start_amount: parseFloat(startAmount || '0'),
      target_date: date,
      frequency: frequencyValue
    }]);

    if (error) return Alert.alert('Insert error', error.message);

    onClose();
    onSaveComplete && onSaveComplete();

    // reset fields
    setGoalName('');
    setTargetAmount('');
    setStartAmount('');
    setFrequencyValue('Monthly');
    setDate(new Date());
  };

  if (!montserratLoaded) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a Goal</Text>

          <TextInput
            placeholder="Goal Name"
            value={goalName}
            onChangeText={setGoalName}
            style={styles.inputBox}
            placeholderTextColor="#BDB1A5"
          />

          <TextInput
            placeholder="Target Amount"
            value={targetAmount}
            onChangeText={setTargetAmount}
            style={styles.inputBox}
            keyboardType="numeric"
            placeholderTextColor="#BDB1A5"
          />

          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateBox}>
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />}

          <DropDownPicker
            open={frequencyOpen}
            value={frequencyValue}
            items={frequencyItems}
            setOpen={setFrequencyOpen}
            setValue={setFrequencyValue}
            setItems={setFrequencyItems}
            style={styles.inputBox}
            textStyle={{ fontSize: 12, fontFamily: 'Montserrat_500Medium', color: '#5C4630' }}
            dropDownContainerStyle={{ borderColor: '#D6C4B2' }}
          />

          <TextInput
            placeholder="Starting Amount"
            value={startAmount}
            onChangeText={setStartAmount}
            style={styles.inputBox}
            keyboardType="numeric"
            placeholderTextColor="#BDB1A5"
          />

          <Pressable style={[styles.button, { backgroundColor: '#C3905E', borderColor: '#C3905E' }]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>

          <Pressable style={[styles.button, { borderColor: '#C3905E', borderWidth: 2 }]} onPress={onClose}>
            <Text style={[styles.buttonText, { color: '#C3905E' }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#FFF8F5',
    padding: 20,
    borderRadius: 20,
    width: '85%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3A2A21'
  },
  inputBox: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    color: '#3A2A21'
  },
  dateBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10
  },
  dateText: {
    fontWeight: 'bold',
    color: '#5C4630'
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '65%',
    marginTop: 8,
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
