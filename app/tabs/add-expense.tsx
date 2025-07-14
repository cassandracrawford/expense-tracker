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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function AddExpenseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0.00');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('Monthly');
  const [transactionTypeIndex, setTransactionTypeIndex] = useState(1);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: 'Food', value: 'Food' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Entertainment', value: 'Entertainment' },
  ]);

  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceValue, setSourceValue] = useState('Cash');
  const [sourceItems, setSourceItems] = useState([
    { label: 'Cash', value: 'Cash' },
    { label: 'Card', value: 'Card' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'PayPal', value: 'PayPal' },
  ]);

  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [recurrenceItems, setRecurrenceItems] = useState([
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Bi-Weekly', value: 'Bi-Weekly' },
    { label: 'Semi-Monthly', value: 'Semi-Monthly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]);

  return (
    <SafeAreaView style={styles.scroll}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.cardBox}>
            <Text style={styles.label}>TRANSACTION TYPE</Text>
            <View style={styles.toggleWrapper}>
              <TouchableOpacity
                style={[styles.toggleButton, transactionTypeIndex === 0 && styles.selectedToggle]}
                onPress={() => router.replace('/tabs/add-income')}
              >
                <Text style={transactionTypeIndex === 0 ? styles.toggleTextSelected : styles.toggleTextUnselected}>
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, transactionTypeIndex === 1 && styles.selectedToggle]}
              >
                <Text style={transactionTypeIndex === 1 ? styles.toggleTextSelected : styles.toggleTextUnselected}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardBox}>
            <Text style={styles.label}>AMOUNT</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountSymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                keyboardType="decimal-pad"
                onChangeText={setAmount}
                placeholderTextColor="#B0A6A0"
              />
            </View>
          </View>

          <View style={[styles.cardBox, { zIndex: 3000 }]}>
            <Text style={styles.label}>DETAILS</Text>
            <View style={styles.rowBetween}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <DropDownPicker
                  open={categoryOpen}
                  value={categoryValue}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={setCategoryValue}
                  setItems={setCategoryItems}
                  placeholder="Select Category"
                  style={styles.dropdown}
                  dropDownContainerStyle={[styles.dropdownBox, { maxHeight: 88 }]}
                  textStyle={styles.dropdownText}
                  listMode="FLATLIST"
                  flatListProps={{
                    scrollEnabled: true,
                    initialNumToRender: 5,
                    getItemLayout: (_, index) => ({
                      length: 44,
                      offset: 44 * index,
                      index,
                    }),
                  }}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
                  <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
                  <Icon name="calendar" size={18} color="#5C4630" style={styles.calendarIcon} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}
              </View>
            </View>

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="(Optional) Add a note"
              placeholderTextColor="#B0A6A0"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.inputLabel}>Payment Method</Text>
            <DropDownPicker
              open={sourceOpen}
              value={sourceValue}
              items={sourceItems}
              setOpen={setSourceOpen}
              setValue={setSourceValue}
              setItems={setSourceItems}
              placeholder="Select Payment Method"
              style={styles.dropdown}
              dropDownContainerStyle={[styles.dropdownBox, { maxHeight: 88 }]}
              textStyle={styles.dropdownText}
              listMode="FLATLIST"
              flatListProps={{
                scrollEnabled: true,
                initialNumToRender: 5,
                getItemLayout: (_, index) => ({
                  length: 44,
                  offset: 44 * index,
                  index,
                }),
              }}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          <View style={[styles.recurrenceBox, { zIndex: 1000 }]}>
            <View>
              <Text style={styles.recurrenceLabel}>Recurring Expense</Text>
              <Text style={styles.recurrenceSubtext}>This expense repeats monthly</Text>
            </View>
            <View style={styles.recurrenceDropdown}>
              <DropDownPicker
                open={recurrenceOpen}
                value={recurrence}
                items={recurrenceItems}
                setOpen={setRecurrenceOpen}
                setValue={setRecurrence}
                setItems={setRecurrenceItems}
                placeholder="Select Recurrence"
                style={styles.dropdownSmall}
                dropDownContainerStyle={[styles.dropdownBox, { maxHeight: 88 }]}
                textStyle={styles.dropdownText}
                listMode="FLATLIST"
                flatListProps={{
                  scrollEnabled: true,
                  initialNumToRender: 5,
                  getItemLayout: (_, index) => ({
                    length: 44,
                    offset: 44 * index,
                    index,
                  }),
                }}
                zIndex={1000}
                zIndexInverse={3000}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  cardBox: {
    backgroundColor: '#F5E5DC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3A2A21',
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    height: 40,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  selectedToggle: {
    backgroundColor: '#C6844F',
  },
  toggleTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  toggleTextUnselected: {
    color: '#5C4630',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  amountSymbol: {
    fontSize: 30,
    color: '#D9534F',
    marginRight: 10,
  },
  amountInput: {
    fontSize: 30,
    color: '#D9534F',
    flex: 1,
    textAlign: 'right',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInputContainer: {
    flex: 1,
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#3A2A21',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: '#3A2A21',
  },
  dateBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  dateText: {
    fontSize: 14,
    color: '#3A2A21',
  },
  calendarIcon: {
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 44,
    borderWidth: 0,
    elevation: 1,
  },
  dropdownSmall: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 44,
    width: 140,
    borderWidth: 0,
    elevation: 1,
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderWidth: 0,
    elevation: 2,
    marginTop: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: '#3A2A21',
  },
  recurrenceBox: {
    backgroundColor: '#C6844F',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recurrenceLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recurrenceSubtext: {
    color: '#fff',
    fontSize: 10,
  },
  recurrenceDropdown: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#D9534F',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
