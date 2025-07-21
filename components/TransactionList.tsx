import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export type TransactionItem = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category?: string;
  isIncome: boolean;
};

type Props = {
  transactions: TransactionItem[];
};

const TransactionList = ({ transactions }: Props) => {
  const renderItem = ({ item }: { item: TransactionItem }) => {
    const label = item.category || item.type;
    const color = item.isIncome ? '#3A8131' : '#D9534F';
    const sign = item.isIncome ? '+' : '-';

    return (
      <View style={styles.transactionItem}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={[styles.amount, { color }]}>
          {sign} ${item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={transactions.slice(0, 4)} 
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false} 
    />
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#3A2A21',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 14,
    color: '#5C4630',
    fontFamily: 'OpenSans_400Regular',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
});

export default TransactionList;
