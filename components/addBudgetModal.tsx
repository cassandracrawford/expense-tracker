import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import supabase from '@/lib/supabase';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveComplete?: () => void;
}


export default function BudgetModal({ visible, onClose, onSaveComplete }: BudgetModalProps) {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryItems, setCategoryItems] = useState([
    { label: 'Housing', value: 'housing' },
    { label: 'Food', value: 'food' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Lifestyle', value: 'lifestyle' },
    { label: 'Health', value: 'health' },
  ]);

  const [budgetTimeOpen, setBudgetTimeOpen] = useState(false);
  const [budgetTimeValue, setBudgetTimeValue] = useState('Monthly');
  const [budgetTimeItems, setBudgetTimeItems] = useState([
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'bi-weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]);

  const [amount, setAmount] = useState('');

  if (!montserratLoaded) return null;

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId || !categoryValue || !amount) {
      console.warn('Missing required fields');
      return;
    }

    const { error } = await supabase.from('budgets').insert({
      user_id: userId,
      category: categoryValue,
      amount: parseFloat(amount),
      period: budgetTimeValue,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('❌ Failed to save budget:', error.message);
      return;
    }

    onSaveComplete?.(); 
    onClose(); 
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Budget</Text>
          <Text style={[styles.text, { marginBottom: 10, textAlign: 'center' }]}>
            Help yourself stay on track and reach your goals by setting a limit for this category.
          </Text>

          {/* Category */}
          <View style={[styles.subcontainer, { flexDirection: 'row', justifyContent: 'space-between', zIndex: 3000 }]}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.subcontainerText}>Category</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <DropDownPicker
                open={categoryOpen}
                value={categoryValue}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                listMode="SCROLLVIEW"
                placeholder="Select category"
                style={styles.dropdown}
                textStyle={[styles.text, { fontSize: 12, fontFamily: 'Montserrat_500Medium' }]}
                dropDownContainerStyle={{ borderColor: '#D6C4B2' }}
              />
            </View>
          </View>

          {/* Budget Period */}
          <View style={[styles.subcontainer, { flexDirection: 'row', justifyContent: 'space-between', zIndex: 2000 }]}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.subcontainerText}>Budget Period</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <DropDownPicker
                open={budgetTimeOpen}
                value={budgetTimeValue}
                items={budgetTimeItems}
                setOpen={setBudgetTimeOpen}
                setValue={setBudgetTimeValue}
                setItems={setBudgetTimeItems}
                listMode="SCROLLVIEW"
                style={styles.dropdown}
                textStyle={[styles.text, { fontSize: 12, fontFamily: 'Montserrat_500Medium' }]}
                dropDownContainerStyle={{ borderColor: '#D6C4B2' }}
              />
            </View>
          </View>

          {/* Amount */}
          <View style={[styles.subcontainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.subcontainerText}>Amount</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.text, { fontFamily: 'Montserrat_700Bold', fontSize: 14 }]}>$</Text>
                <TextInput
                  style={[styles.input]}
                  placeholder="0.00"
                  placeholderTextColor="#5C4630"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.button, { backgroundColor: '#C3905E', borderWidth: 2, borderColor: '#C3905E' }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable style={[styles.button, { borderWidth: 2, borderColor: '#C3905E' }]} onPress={onClose}>
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
    width: 120,
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
    paddingHorizontal: 10,
    minWidth: 100,
    borderColor: '#D6C4B2',
    borderWidth: 1,
  },
});
