import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { LineChart } from 'react-native-chart-kit';
import { PieChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

type Transaction = {
  type: string;
  amount: number;
  category: string;
  date: string;
};

type TimeOption = 'Daily' | 'Weekly' | 'Monthly';

export default function ReportScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});
    
    const [selected, setSelected] = useState<TimeOption>('Daily');
    const options: TimeOption[] = ['Daily', 'Weekly', 'Monthly'];

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
      const loadSession = async() => {
        const {data: {session}} = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
        }
      };
      loadSession();
    }, []);

    // Get transactions - expenses from database
    useEffect(() => {
  const fetchTransactions = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'expense')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setTransactions(data || []);
    }
  };

  if (isFocused) {
    fetchTransactions();
  }
}, [isFocused, currentUser]);

    // Group transactions by date
    const parseDate = (dateStr: string) => new Date(dateStr);
    const weekNumber = (date: Date) => {
      const start = new Date(date.getFullYear(), 0, 1);
      const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return Math.ceil((diff + start.getDay() + 1) / 7);
    };

    const groupTransactions = () => {
      if (selected === 'Daily') {
        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6-i));
          return d;
        });

        const labels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short'}));
        const data = last7Days.map( d => {
          const key= d.toISOString().split('T')[0];
          return transactions
            .filter(t => t.date.startsWith(key))
            .reduce((sum, t) => sum + t.amount, 0);
        });
        return {labels, data};
      }

      if (selected === 'Weekly') {
        const weekTotals: Record<string, number> = {};
        transactions.forEach( t => {
          const week = weekNumber(parseDate(t.date));
          const label = `W${week}`;
          weekTotals[label] = (weekTotals[label] || 0) + t.amount;
        });
        const labels = Object.keys(weekTotals).slice(-4);
        const data = labels.map(l => weekTotals[l]);
        return {labels, data}; 
      }

      if (selected === 'Monthly') {
        const monthTotals: Record<string, number> = {};
        transactions.forEach(t => {
          const d = parseDate(t.date);
          const label = d.toLocaleDateString('en-US', {month: 'short'});
          monthTotals[label] = (monthTotals[label] || 0) + t.amount;
        });
        const labels = Object.keys(monthTotals).slice(-6);
        const data = labels.map(l => monthTotals[l]);
        return {labels, data};
      }
      return {labels: [], data: []}
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

    const {labels, data} = groupTransactions();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    return (
      <ScrollView style={styles.container}>
        
        {/* Toggle Bar - Daily, Weekly, or Monthly */}
        <View style={styles.bar}>
          {options.map((option) => (
            <TouchableOpacity
            key={option}
            style={[
            styles.button,
            selected === option && styles.selectedButton,
            ]}
            onPress={() => setSelected(option)}
          >
          <Text
            style={[
              styles.buttonText,
              selected === option && styles.selectedText,
            ]}
          >
            {option}
          </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.subContainer, {paddingLeft: 0, paddingBottom: 0}]}>
      <LineChart
        data={{
          labels: labels.length > 0 ? labels : ['No Data'],
          datasets: [{ data: data.length > 0 ? data : [0], strokeWidth: 2 }],
        }}
        width={screenWidth - 60}
        height={220}
        chartConfig={{
          backgroundColor: '#F5E5DC',
          backgroundGradientFrom: '#F5E5DC',
          backgroundGradientTo: '#F5E5DC',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`, 
          labelColor: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#B7A690',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginHorizontal: 0,
        }}
      />
      </View>
      <View style={[styles.subContainer, {alignItems: 'center', justifyContent: 'center'}]}>
        <Text style={[styles.text, {
          color: '#3A2A21', 
          textTransform: 'uppercase',
          lineHeight: 20,
          fontSize: 16,
        }]}>
          Total Spent {selected}
        </Text>
        <Text style={[styles.text, {
          color: '#D2996C',
          fontSize: 30,
        }]}>${totalSpent}</Text>
      </View>
      <View style={styles.subContainer}>
        {/* Top Categories */}
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Text style={[
            styles.text,
            { color: '#3A2A21', fontSize: 16, paddingVertical: 5 }
          ]}>
            Top Categories:
          </Text>
        {Object.keys(categoryTotals)
          .sort((a, b) => categoryTotals[b] - categoryTotals[a]) // sort descending
          .slice(0, 3) // top 3
          .map((cat) => (
          <Text key={cat} style={styles.category}>{cat}</Text>
        ))}
      </View>
      <PieChart
          data={pieData.length > 0 ? pieData : [
            { name: 'No Data', spending: 1, color: '#E0E0E0', legendFontColor: '#3A2A21', legendFontSize: 12 },
          ]}
          width={screenWidth - 60}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`,
          }}
          accessor="spending"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute 
        />
      </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#f3e5d8', // light tan bg
    borderRadius: 10,
    padding: 0,
    alignSelf: 'flex-start',
    width: '100%',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    flex: 1,
    backgroundColor: '#C3905E', 
  },
  buttonText: {
    color: '#3C2B1C', 
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
  },
  selectedText: {
    color: 'white',
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    minHeight: 100,
    borderRadius: 20,
    padding: 20,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
  },
  category: {
    backgroundColor: '#D2996C',
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    borderRadius: 10,
  }
});
