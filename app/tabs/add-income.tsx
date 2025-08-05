import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabase";
import { Alert } from "react-native";

export default function AddIncomeScreen() {
  const router = useRouter();

  const [amount, setAmount] = useState("0.00");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState("Monthly");
  const [transactionTypeIndex, setTransactionTypeIndex] = useState(0);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Salary", value: "Salary" },
    { label: "Freelance", value: "Freelance" },
    { label: "Bonus", value: "Bonus" },
    { label: "Rental Income", value: "Rental Income" },
    { label: "Side Hustle", value: "Side Hustle" },
  ]);

  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceValue, setSourceValue] = useState(null);
  const [sourceItems, setSourceItems] = useState([
    { label: "Cash", value: "Cash" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "PayPal", value: "PayPal" },
    { label: "Cheque", value: "Cheque" },
    { label: "Employer", value: "Employer" },
  ]);

  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [recurrenceItems, setRecurrenceItems] = useState([
    { label: "Weekly", value: "Weekly" },
    { label: "Bi-Weekly", value: "Bi-Weekly" },
    { label: "Semi-Monthly", value: "Semi-Monthly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ]);

  const resetForm = () => {
    setAmount("0.00");
    setDate(new Date());
    setDescription("");
    setCategoryValue(null);
    setSourceValue(null);
    setRecurrence("Monthly");
    setCategoryOpen(false);
    setSourceOpen(false);
    setRecurrenceOpen(false);
  };

  const handleSaveIncome = async () => {
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data?.user) {
      console.error("User fetch error:", userError);
      Alert.alert("Error", "Failed to fetch user data");
      return;
    }

    const userId = data.user.id;

    const { error } = await supabase.from("transactions").insert([
      {
        amount: parseFloat(amount),
        date: date.toISOString(),
        description,
        category: categoryValue,
        payment_method: sourceValue,
        type: "income",
        is_recurring: true,
        recurrence_frequency: recurrence,
        user_id: userId, // ✅ 正確的 user id
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      Alert.alert("Error", "Failed to save income");
    } else {
      Alert.alert("Income saved!", "", [
        { 
          text: "OK", 
          onPress: () => {
            resetForm();
            router.replace("/tabs"); 
          }
        }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.scroll}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.cardBox}>
            <Text style={styles.label}>TRANSACTION TYPE</Text>
            <View style={styles.toggleWrapper}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionTypeIndex === 0 && styles.selectedToggle,
                ]}
                onPress={() => setTransactionTypeIndex(0)}
              >
                <Text
                  style={
                    transactionTypeIndex === 0
                      ? styles.toggleTextSelected
                      : styles.toggleTextUnselected
                  }
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionTypeIndex === 1 && styles.selectedToggle,
                ]}
                onPress={() => router.replace("/tabs/add-expense")}
              >
                <Text
                  style={
                    transactionTypeIndex === 1
                      ? styles.toggleTextSelected
                      : styles.toggleTextUnselected
                  }
                >
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
                <Text style={styles.inputLabel}>Income Category</Text>
                <DropDownPicker
                  open={categoryOpen}
                  value={categoryValue}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={setCategoryValue}
                  setItems={setCategoryItems}
                  placeholder="Select Category"
                  style={styles.dropdown}
                  dropDownContainerStyle={[
                    styles.dropdownBox,
                    { maxHeight: 88 },
                  ]}
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
                <Text style={styles.inputLabel}>Date Received</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateBox}
                >
                  <Text style={styles.dateText}>
                    {date.toISOString().split("T")[0]}
                  </Text>
                  <Icon
                    name="calendar"
                    size={18}
                    color="#6B4C3B"
                    style={styles.calendarIcon}
                  />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "default" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                    style={{
                      marginBottom: 10,
                      alignSelf: "flex-end",
                      marginTop: 10,
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

            <Text style={styles.inputLabel}>Income Source</Text>
            <DropDownPicker
              open={sourceOpen}
              value={sourceValue}
              items={sourceItems}
              setOpen={setSourceOpen}
              setValue={setSourceValue}
              setItems={setSourceItems}
              placeholder="Select Income Source"
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
            <View style={{ flex: 1 }}>
              <Text style={styles.recurrenceLabel}>Recurring Income</Text>
              <Text style={styles.recurrenceSubtext}>
                This income repeats monthly
              </Text>
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

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveIncome}
          >
            <Text style={styles.saveButtonText}>Save Income</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFF8F2",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  cardBox: {
    backgroundColor: "#FBECE3",
    paddingTop: 14,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#3C2C1E",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    height: 40,
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  selectedToggle: {
    backgroundColor: "#C67C4F",
  },
  toggleTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  toggleTextUnselected: {
    color: "#6B4C3B",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
    height: 44,
  },
  amountSymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginRight: 10,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    flex: 1,
    textAlign: "right",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfInputContainer: {
    flex: 1,
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#6B4C3B",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: "#6B4C3B",
    height: 44,
  },
  dateBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#6B4C3B",
  },
  calendarIcon: {
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 44,
    borderWidth: 0,
    elevation: 1,
  },
  dropdownSmall: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 44,
    width: 140,
    borderWidth: 0,
    elevation: 1,
  },
  dropdownBox: {
    backgroundColor: "#fff",
    borderWidth: 0,
    elevation: 2,
    marginTop: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: "#6B4C3B",
  },
  recurrenceBox: {
    backgroundColor: "#C67C4F",
    borderRadius: 10,
    paddingBottom: 20,
    paddingTop: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recurrenceLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  recurrenceSubtext: {
    color: "#fff",
    fontSize: 10,
  },
  recurrenceDropdown: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#92C7A3",
    alignSelf: "flex-end",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    width: "45%",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
