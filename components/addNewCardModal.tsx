import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import React from 'react';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';
import supabase from '@/lib/supabase';

interface SavingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddNewCardModal({ visible, onClose }: SavingsModalProps) {
  const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium});
  

  const [cardTypeOpen, setCardTypeOpen] = useState(false);
  const [cardTypeValue, setCardTypeValue] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');

  const [cardTypeItems, setCardTypeItems] = useState([
    { label: 'Visa', value: 'visa' },
    { label: 'Mastercard', value: 'mastercard' },
  ]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
        if (event.type === 'set' && selectedDate) {
        setDate(selectedDate); // update date
    }
    setShowPicker(false); // hide after any interaction (set or dismiss)
    } else if (Platform.OS === 'ios' && selectedDate) {
        setDate(selectedDate); // update live as user scrolls
    }
    };

  if (!montserratLoaded) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Card</Text>

            <View style={styles.subcontainer}>
                <Text style={styles.subcontainerText}>Card Name</Text>
                <TextInput 
                    style={{
                        backgroundColor: '#FFFFFF',    
                        borderColor: '#D6C4B2',
                        borderWidth:1,
                        borderRadius: 8,
                        paddingVertical: 13,
                        paddingHorizontal:10,
                        color: '#5C4630',
                        fontFamily: 'Montserrat_400Regular'
                    }}
                    placeholder='e.g. Dream Vacation, New Car'
                    placeholderTextColor='#BDB1A5'
                    value={cardName}
                    onChangeText={setCardName}
                />
                <Text style={styles.subcontainerText}>Card Type</Text>
                <DropDownPicker
                    open={cardTypeOpen}
                    value={cardTypeValue}
                    items={cardTypeItems}
                    setOpen={setCardTypeOpen}
                    setValue={setCardTypeValue}
                    setItems={setCardTypeItems}
                    listMode="SCROLLVIEW"
                    placeholder="Select card type"
                    style={styles.dropdown}
                    textStyle={[styles.text,{fontSize: 12, fontFamily: 'Montserrat_500Medium'}]}
                    dropDownContainerStyle={{ borderColor: '#D6C4B2'}}
                />
                <Text style={styles.subcontainerText}>Card Number</Text>
                <TextInput 
                    style={{
                        backgroundColor: '#FFFFFF',    
                        borderColor: '#D6C4B2',
                        borderWidth:1,
                        borderRadius: 8,
                        paddingVertical: 13,
                        paddingHorizontal:10,
                        color: '#5C4630',
                        fontFamily: 'Montserrat_400Regular'
                    }}
                    placeholder='1234 5678 0000 9007'
                    placeholderTextColor='#BDB1A5'
                    keyboardType='numeric'
                    value={cardNumber}
                    onChangeText={setCardNumber}
                />

                <Text style={styles.subcontainerText}>Current Balance</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.text,{fontFamily: 'Montserrat_700Bold', fontSize: 14}]}>$</Text>
                    <TextInput 
                        style={[styles.input]}
                        placeholder='0.00'
                        placeholderTextColor='#5C4630'
                        keyboardType="numeric"
                        value={balance}
                        onChangeText={setBalance}
                    />
                </View>
                <Text style={styles.subcontainerText}>Spending Limit</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.text,{fontFamily: 'Montserrat_700Bold', fontSize: 14}]}>$</Text>
                    <TextInput 
                        style={[styles.input]}
                        placeholder='0.00'
                        placeholderTextColor='#5C4630'
                        keyboardType="numeric"
                        value={limit}
                        onChangeText={setLimit}
                    />
                </View>
                <Text style={styles.subcontainerText}>Payment Due Date</Text>
                <View>
                    <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker(true)}>
                        <Text style={styles.dateText}>
                            {date.toLocaleDateString()} {/* Or any format you prefer */}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && Platform.OS === 'android' && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    {Platform.OS === 'ios' && showPicker && (
                        <View style={styles.iosPickerContainer}>
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={onChange}
                        />
                        </View>
                    )}
                </View>
            </View>

            {/* Save Button */}
            <Pressable
              style={[styles.button, { backgroundColor: '#C3905E', borderWidth: 2, borderColor: '#C3905E' }]}
              onPress={async () => {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                  Alert.alert('Error', 'User not authenticated.');
                  return;
                }

                if (!cardName || !cardNumber || !cardTypeValue) {
                  Alert.alert('Missing Info', 'Please fill in all required fields.');
                  return;
                }

                const { error } = await supabase.from('cards').insert({
                  user_id: user.id,
                  name: cardName,
                  number: cardNumber,
                  balance: parseFloat(balance) || 0,
                  spending_limit: parseFloat(limit) || 0,
                  due_date: date.toISOString(),
                  type: cardTypeValue,
                });

                if (error) {
                  Alert.alert('Insert Failed', error.message);
                } else {
                  Alert.alert('Success', 'Card added!');
                  onClose();
                  setCardName('');
                  setCardNumber('');
                  setBalance('');
                  setLimit('');
                  setCardTypeValue('');
                  setDate(new Date());
                }
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>


            {/* Cancel Button */}
            <Pressable style={[styles.button,{borderWidth: 2, borderColor: '#C3905E'}]} onPress={onClose}>
                <Text style={[styles.buttonText, {color: '#C3905E'}]}>Cancel</Text>
            </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF8F5',
    borderColor: '#C6844F',
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#3A2A21',
  },
  input: {
    color: '#5C4630',
    fontFamily: 'Montserrat_700Bold', 
    fontSize: 14,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '65%',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#5C4630',
  },
  subcontainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 5,
    borderRadius: 15,
    padding: 15,
    width: '100%',
  },
  subcontainerText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#5C4630',
    textAlignVertical: 'center',
    margin: 5,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6C4B2',
    borderRadius: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal:10,
    borderColor: '#D6C4B2',
    borderWidth:1,
  },
dateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: '#D6C4B2',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#5C4630',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iosPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
});