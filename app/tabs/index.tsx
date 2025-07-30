import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  useFonts as useMontserratFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  useFonts as useOpenSansFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import {
  useFonts as usePoppinsFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Link } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import supabase from '../../lib/supabase';
import { DonutChart } from '../../components/dashboardComponents';
import TransactionList, { TransactionItem } from '../../components/TransactionList';
import { useUserFinanceData } from '../../hooks/useUserFinanceData'; 
import ReminderCard from '../../components/remindercard';


export default function Dashboard() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });
  const [opensansLoaded] = useOpenSansFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const [poppinsLoaded] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });


  const [userName, setUserName] = useState<string>('User');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const { totalBudget, totalSpent, percentageUsed, refresh } = useUserFinanceData();

  const ensureUserRowExists = async (user: any) => {
    const { id, email, user_metadata } = user;
    const fullName = user_metadata?.full_name || 'User';

    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Failed to check users table:', fetchError.message);
      return;
    }

    if (!existing) {
      console.log('🚧 No user row found, inserting...');
      const { error: insertError } = await supabase.from('users').insert([
        {
          id,
          full_name: fullName,
          email,
          currency: 'USD',
          language: 'en',
        },
      ]);

      if (insertError) {
        console.error(' Failed to insert user row:', insertError.message);
      } else {
        console.log(' User row inserted successfully');
      }
    } else {
      console.log('User row already exists');
    }
  };

  const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error.message);
      return;
    }

    const mapped = data.map((t) => ({
      ...t,
      isIncome: t.type === 'income',
    })) as TransactionItem[];

    setTransactions(mapped);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'No user');
        return;
      }

      await ensureUserRowExists(user);

      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle() as { data: any; error: import('@supabase/supabase-js').PostgrestError | null };

      const name = (data?.full_name || user.user_metadata?.full_name || 'User').split(' ')[0];
      setUserName(name);
      fetchTransactions(user.id);

      if (!data) {
        console.warn(' No user row found, falling back to metadata');
      } else if (error) {
        console.error('Error fetching full_name:', error?.message);
      }
    } catch (e) {
      console.error('Unexpected error:', e);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

useFocusEffect(
  useCallback(() => {
    fetchUserData();
    refresh();
  }, [refresh])
);

  const fontsLoaded = montserratLoaded && opensansLoaded && poppinsLoaded;
  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hello, {userName}!</Text>

      {/* Main Budget Section */}
      <View style={[styles.subContainer, { paddingTop: 30 }]}>
        <View style={{ flexDirection: 'column', gap: 20 }}>
          <DonutChart percentage={percentageUsed} />
          <View style={{ flexDirection: 'column', gap: 20 }}>
            <View>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={[styles.legend, { backgroundColor: '#B6A089' }]} />
                  <Text style={styles.chartLabel}>Total Budget</Text>
                </View>
                <Text style={[styles.chartAmount, { color: '#B6A089' }]}>
                  ${totalBudget.toLocaleString()}
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={[styles.legend, { backgroundColor: '#5C4630' }]} />
                  <Text style={styles.chartLabel}>Total Spent</Text>
                </View>
                <Text style={[styles.chartAmount, { color: '#5C4630' }]}>
                  ${totalSpent.toLocaleString()}
                </Text>
              </View>
            </View>
            <Link style={[styles.linkStyle, { alignSelf: 'flex-end' }]} href="/tabs/report">
              View Breakdown
            </Link>
          </View>
        </View>
      </View>

      {/* Reminders */}
      <View style={styles.subContainer}>
        <Text style={styles.containerTitle}>Reminders</Text>
        <ReminderCard />
      </View>

      {/* Transactions */}
      <View style={styles.subContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.containerTitle}>Recent Transactions</Text>
          <Link style={styles.linkStyle} href="/tabs/cards">
            View All
          </Link>
        </View>
        {transactions.length > 0 ? (
          <TransactionList transactions={transactions} />
        ) : (
          <Text style={styles.emptyText}>No transactions available.</Text>
        )}
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
  title: {
    fontSize: 32,
    fontFamily: 'OpenSans_700Bold',
    color: '#3A2A21',
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
  },
  containerTitle: {
    fontFamily: 'Poppins_500Medium',
    textTransform: 'uppercase',
    fontSize: 18,
    color: '#3A2A21',
  },
  linkStyle: {
    fontFamily: 'Poppins_700Bold',
    color: '#C6844F',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  chartAmount: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  chartLabel: {
    fontSize: 18,
    color: '#3A2A21',
    fontFamily: 'Montserrat_700Bold',
  },
  legend: {
    width: 8,
    height: 24,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
