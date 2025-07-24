import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import React from 'react';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';

interface SavingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SavingsModal({ visible, onClose }: SavingsModalProps) {
  const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium});

  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState('Monthly');
  const [frequencyItems, setFrequencyItems] = useState([
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'Bi-Weekly' },
    { label: 'Monthly', value: 'Monthly' },
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
            <Text style={styles.modalTitle}>Add a Goal</Text>
            <Text style={[styles.text, {marginBottom: 10, textAlign: 'center'}]}>
                Set a goal to plan ahead and stay motivated with your finances.
            </Text>

            <View style={styles.subcontainer}>
                <Text style={styles.subcontainerText}>Goal Name</Text>
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
                />
                <Text style={styles.subcontainerText}>Target Amount</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.text,{fontFamily: 'Montserrat_700Bold', fontSize: 14}]}>$</Text>
                    <TextInput 
                        style={[styles.input]}
                        placeholder='0.00'
                        placeholderTextColor='#5C4630'
                        keyboardType="numeric"
                        // value={name}
                        // onChangeText={setName}
                    />
                </View>
                <Text style={styles.subcontainerText}>Target Date</Text>
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
                <Text style={styles.subcontainerText}>Frequency</Text>
                <DropDownPicker
                    open={frequencyOpen}
                    value={frequencyValue}
                    items={frequencyItems}
                    setOpen={setFrequencyOpen}
                    setValue={setFrequencyValue}
                    setItems={setFrequencyItems}
                    listMode="SCROLLVIEW"
                    style={styles.dropdown}
                    textStyle={[styles.text,{fontSize: 12, fontFamily: 'Montserrat_500Medium'}]}
                    dropDownContainerStyle={{ borderColor: '#D6C4B2'}}
                />
                <Text style={styles.subcontainerText}>Starting Amount</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.text,{fontFamily: 'Montserrat_700Bold', fontSize: 14}]}>$</Text>
                    <TextInput 
                        style={[styles.input]}
                        placeholder='0.00'
                        placeholderTextColor='#5C4630'
                        keyboardType="numeric"
                        // value={name}
                        // onChangeText={setName}
                    />
                </View>
            </View>

            {/* Save Button */}
            <Pressable style={[styles.button,{backgroundColor: '#C3905E', borderWidth: 2, borderColor: '#C3905E'}]} onPress={onClose}>
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