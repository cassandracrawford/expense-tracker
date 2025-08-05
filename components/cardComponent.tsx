import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type prop = {
  cardName: string;
  cardEnding: number;
  cardExpense: number;
  cardDueDate: string;
  cardType: string;
  onDelete?: () => void;
};

export default function CreditCard({
  cardName,
  cardEnding,
  cardExpense,
  cardDueDate,
  cardType,
  onDelete,
}: prop) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title}>{cardName}</Text>
          <Text style={styles.subtitle}>**** **** **** {cardEnding}</Text>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#E65C5C",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
          }}
          onPress={onDelete}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalAmount}>Total Expenses: ${cardExpense}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>Due: {cardDueDate}</Text>
        <Text style={styles.title}>{cardType}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    width: 340,
    borderWidth: 2,
    borderColor: "#3A3121",
    marginBottom: 10,
  },
  title: {
    color: "#3A2A21",
    textTransform: "uppercase",
    lineHeight: 20,
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  subtitle: {
    color: "#5C4630",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  totalAmount: {
    color: "#D2996C",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 40,
  },
});
