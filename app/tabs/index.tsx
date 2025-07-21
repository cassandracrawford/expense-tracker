import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  useFonts as useMontserratFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import {
  useFonts as useOpenSansFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import {
  useFonts as usePoppinsFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';
import TransactionList, { DonutChart, ReminderCard } from '../../components/dashboardComponents';

export default function Dashboard() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold
  });
  const [opensansLoaded] = useOpenSansFonts({
    OpenSans_400Regular,
    OpenSans_700Bold
  });
  const [poppinsLoaded] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'No user found');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching full_name:', error.message);
        } else if (!data) {
          // fallback to metadata, user row not found 
          const firstName = (user.user_metadata?.full_name || 'User').split(' ')[0];
          setUserName(firstName);
        } else {
          const firstName = (data.full_name || 'User').split(' ')[0];
          setUserName(firstName);
        }
      } catch (e) {
        console.error('Unexpected error:', e);
      }
    };

    fetchUserName();
  }, []);

  if (!montserratLoaded || !opensansLoaded || !poppinsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hello, {userName}!</Text>

      <View style={[styles.subContainer, { paddingTop: 30}]}>
        <View style={{ flexDirection: 'column', gap: 20 }}>
          <DonutChart percentage={0} />
          <View style={{ flexDirection: 'column', gap: 20 }}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.legend, { backgroundColor: '#B6A089' }]} />
                  <Text style={styles.chartLabel}>Total Budget</Text>
                </View>
                <Text style={[styles.chartAmount, { color: '#B6A089' }]}>$0</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.legend, { backgroundColor: '#5C4630' }]} />
                  <Text style={styles.chartLabel}>Total Spent</Text>
                </View>
                <Text style={[styles.chartAmount, { color: '#5C4630' }]}>$0</Text>
              </View>
            </View>
            <Link style={[styles.linkStyle, { alignSelf: 'flex-end' }]} href='/tabs/report'>View Breakdown</Link>
          </View>
        </View>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.containerTitle}>Reminders</Text>
        <ReminderCard />
      </View>

      <View style={styles.subContainer}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <Text style={styles.containerTitle}>Recent Transactions</Text>
          <Link style={styles.linkStyle} href='/tabs/cards'>View All</Link>
        </View>
        <TransactionList transactions={[]} />
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
    minHeight: 100,
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
});
