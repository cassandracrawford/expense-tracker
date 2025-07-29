import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
};

type TimeOption = 'Daily' | 'Weekly' | 'Monthly';

export default function ReportScreen() {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_700Bold });
  const [opensansLoaded] = useOpenSansFonts({ OpenSans_400Regular, OpenSans_700Bold });

  const [selected, setSelected] = useState<TimeOption>('Daily');
  const options: TimeOption[] = ['Daily', 'Weekly', 'Monthly'];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const isFocused = useIsFocused();

  const fetchTransactions = async () => {
    if (!currentUser) return;

    const { data: fetchedTransactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'expense')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setTransactions(fetchedTransactions || []);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      Alert.alert('Delete failed', error.message);
    } else {
      Alert.alert('Deleted!');
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchTransactions();
    }
  }, [isFocused, currentUser]);

  const parseDate = (dateStr: string) => new Date(dateStr);
  const weekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((diff + start.getDay() + 1) / 7);
  };

  const groupTransactions = () => {
    if (!transactions.length) return { labels: [], data: [] };

    const now = new Date();

    if (selected === 'Daily') {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        return d;
      });

      const labels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));
      const data = last7Days.map(d => {
        const key = d.toISOString().split('T')[0];
        return transactions
          .filter(t => t.date.startsWith(key))
          .reduce((sum, t) => sum + t.amount, 0);
      });
      return { labels, data };
    }

    if (selected === 'Weekly') {
      const weekTotals: Record<string, number> = {};
      transactions.forEach(t => {
        const week = weekNumber(parseDate(t.date));
        const label = `W${week}`;
        weekTotals[label] = (weekTotals[label] || 0) + t.amount;
      });
      const labels = Object.keys(weekTotals).slice(-4);
      const data = labels.map(l => weekTotals[l]);
      return { labels, data };
    }

    if (selected === 'Monthly') {
      const monthTotals: Record<string, number> = {};
      transactions.forEach(t => {
        const d = parseDate(t.date);
        const label = d.toLocaleDateString('en-US', { month: 'short' });
        monthTotals[label] = (monthTotals[label] || 0) + t.amount;
      });
      const labels = Object.keys(monthTotals).slice(-6);
      const data = labels.map(l => monthTotals[l]);
      return { labels, data };
    }

    return { labels: [], data: [] };
  };

  const now = new Date();
  const filteredTransactions = transactions.filter((t) => {
    const txDate = new Date(t.date);

    if (selected === 'Daily') {
      return (
        txDate.getFullYear() === now.getFullYear() &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getDate() === now.getDate()
      );
    }

    if (selected === 'Weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return txDate >= weekAgo && txDate <= now;
    }

    if (selected === 'Monthly') {
      return (
        txDate.getFullYear() === now.getFullYear() &&
        txDate.getMonth() === now.getMonth()
      );
    }

    return false;
  });

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const categoryTotals: Record<string, number> = {};
  filteredTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const pieData = Object.keys(categoryTotals).map((category, index) => ({
    name: category,
    spending: categoryTotals[category],
    color: ['#D2996C', '#DAB9A7', '#FDB892', '#C6844F'][index % 4],
    legendFontColor: '#3A2A21',
    legendFontSize: 12,
  }));

  const { labels, data } = groupTransactions();

  useEffect(() => {
    const insertSpendingNotification = async () => {
      if (!currentUser || totalSpent <= 0) return;

      const message = `You spent $${totalSpent.toFixed(2)} this ${selected.toLowerCase()}.`;
      const today = new Date().toISOString().split("T")[0];

      const { data: existing, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("type", "report")
        .gte("created_at", today + "T00:00:00.000Z");

      if (fetchError) {
        console.error("❌ Error checking existing notifications:", fetchError.message);
        return;
      }

      if (existing && existing.length > 0) return;

      const { error } = await supabase.from("notifications").insert([
        {
          user_id: currentUser.id,
          message,
          type: "report",
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("❌ Failed to insert notification:", error.message);
      }
    };

    insertSpendingNotification();
  }, [totalSpent, selected, currentUser]);

  if (!montserratLoaded || !opensansLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Toggle */}
      <View style={styles.bar}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.button, selected === option && styles.selectedButton]}
            onPress={() => setSelected(option)}
          >
            <Text style={[styles.buttonText, selected === option && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Charts */}
      <View style={styles.subContainer}>
        <LineChart
          data={{
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{ data: data.length > 0 ? data : [0] }],
          }}
          width={screenWidth - 60}
          height={220}
          chartConfig={{
            backgroundColor: '#F5E5DC',
            backgroundGradientFrom: '#F5E5DC',
            backgroundGradientTo: '#F5E5DC',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`,
            labelColor: () => '#5C4630',
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={[styles.text, { fontSize: 16 }]}>Total Spent {selected}</Text>
        <Text style={[styles.text, { fontSize: 30, color: '#D2996C' }]}>${totalSpent.toFixed(2)}</Text>
      </View>

      <View style={styles.subContainer}>
        <Text style={[styles.text, { fontSize: 16 }]}>Top Categories:</Text>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginVertical: 10 }}>
          {Object.keys(categoryTotals)
            .sort((a, b) => categoryTotals[b] - categoryTotals[a])
            .slice(0, 3)
            .map((cat) => (
              <Text key={cat} style={styles.category}>{cat}</Text>
            ))}
        </View>
        <PieChart
          data={pieData.length > 0 ? pieData : [{
            name: 'No Data',
            spending: 1,
            color: '#E0E0E0',
            legendFontColor: '#3A2A21',
            legendFontSize: 12,
          }]}
          width={screenWidth - 60}
          height={220}
          chartConfig={{ color: () => '#5C4630' }}
          accessor="spending"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      </View>

      {/* Transactions + Delete */}
      <View style={styles.subContainer}>
        <Text style={[styles.text, { color: '#3A2A21', fontSize: 16, marginBottom: 10 }]}>
          Recent Transactions:
        </Text>
        {filteredTransactions.map((t) => (
          <View key={t.id} style={{ marginBottom: 10, backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#3A2A21' }}>
              {t.category} - ${t.amount.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#5C4630' }}>
              {t.date.split('T')[0]}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 5,
                backgroundColor: '#D9534F',
                paddingVertical: 5,
                borderRadius: 5,
                alignSelf: 'flex-start',
                paddingHorizontal: 10,
              }}
              onPress={() => handleDelete(t.id)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#f3e5d8',
    borderRadius: 10,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#C3905E',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#3C2B1C',
  },
  selectedText: {
    color: '#FFF',
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    color: '#3A2A21',
  },
  category: {
    backgroundColor: '#D2996C',
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    borderRadius: 10,
  },
});
