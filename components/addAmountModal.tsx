import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { useState } from "react";
import supabase from "@/lib/supabase";

interface AddSavingsModalProps {
  visible: boolean;
  onClose: () => void;
  goalId: string;
  onSaveComplete: () => void;
}

export default function AddSavingsModal({
  visible,
  onClose,
  goalId,
  onSaveComplete,
}: AddSavingsModalProps) {
  const [amount, setAmount] = useState("");
  const presetValues = [10, 20, 50, 100];

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const { error } = await supabase.from("savings").insert({
      goal_id: goalId,
      user_id: user.id,
      amount: numericAmount,
      date: new Date().toISOString().split("T")[0],
    });

    onSaveComplete?.();

    if (error) {
      console.error("Failed to add savings:", error.message);
      alert("Failed to save savings.");
    } else {
      onClose();
      onSaveComplete?.();
      setAmount("");
    }
  };

  const handlePreset = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {presetValues.map((value) => (
              <Pressable
                key={value}
                style={styles.amountButton}
                onPress={() => handlePreset(value)}
              >
                <Text style={styles.amountText}>${value}</Text>
              </Pressable>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              width: "100%",
            }}
          >
            <Text
              style={{ color: "#A3C9A8", fontWeight: "bold", fontSize: 18 }}
            >
              Custom Amount:
            </Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.inputWrapper}>
                <Text
                  style={{
                    fontFamily: "Montserrat_700Bold",
                    fontSize: 14,
                    color: "#A3C9A8",
                  }}
                >
                  $
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#A3C9A8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "#A3C9A8", borderColor: "#A3C9A8" },
              ]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                Enter
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, { borderColor: "#A3C9A8" }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: "#A3C9A8" }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#FFF8F5",
    borderColor: "#A3C9A8",
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  amountButton: {
    backgroundColor: "#A3C9A8",
    borderRadius: 8,
    padding: 15,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  amountText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    paddingVertical: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  input: {
    color: "#A3C9A8",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
});
