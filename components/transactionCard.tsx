import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';
import { StyleSheet, View, Text } from "react-native";

export default function TransactionCard({ transaction } : {transaction: any}) {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_400Regular_Italic
  });

  if (!montserratLoaded) return null;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{transaction.category}</Text>
        <Text style={styles.subTitle}>
          {transaction.description || 'No description'}
        </Text>
      </View>
      <View>
        <Text style={[styles.title, { textAlign: 'right' }]}>${transaction.amount}</Text>
        <Text style={[styles.subTitle, { textAlign: 'right' }]}>
          {transaction.payment_method}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5E5DC',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    color: '#3A2A21',
    fontSize: 18,
  },
  subTitle: {
    fontFamily: 'Montserrat_400Regular_Italic',
    color: '#3A2A21',
    fontSize: 14,
  }
});