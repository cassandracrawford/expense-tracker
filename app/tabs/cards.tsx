import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, Dimensions, Pressable } from 'react-native'; // Import RefreshControl and ScrollView
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';
import { useEffect, useState, useCallback } from 'react'; 
import { SwipeListView } from 'react-native-swipe-list-view';
import supabase from '@/lib/supabase';
import TransactionCard from '@/components/transactionCard';
import { User } from '@supabase/supabase-js'; 
import { useIsFocused } from '@react-navigation/native'; 
import { PieChart } from 'react-native-chart-kit';
import CreditCard from '@/components/cardComponent';
import AddNewCardModal from '@/components/addNewCardModal';

const screenWidth = Dimensions.get('window').width;

export default function CardsScreen() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_400Regular_Italic
  });

  type Transaction = {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    description?: string;
    payment_method: string;
    date: Date;
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [selectedTab, setSelectedTab] = useState<'All' | 'Credit Card' | 'Cash'>('All');
  const cardExpense = 1200;
  const cashExpense = 235;

  const isFocused = useIsFocused();
  const [modalNewCardVisible, setModalNewCardVisible] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false); 
      return;
    }

    try {
      setIsLoading(true); // Initial load or manual refresh
      setIsRefreshing(true); // For pull-to-refresh
      const { data, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false });

      if (transError) {
        console.error('Transaction fetch error:', transError.message);
      }

      setTransactions(data ?? []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); 
    }
  }, [currentUser]); 

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
        } else {
          setCurrentUser(null);
          setTransactions([]);
          setIsLoading(false);
        }
      }
    );

    const checkInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Initial session fetch error:', error.message);
      }
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    };

    checkInitialSession();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Effect to fetch transactions when currentUser changes (initial load/login)
  useEffect(() => {
    if (currentUser !== null) {
      fetchTransactions();
    }
  }, [currentUser, fetchTransactions]);

  // Only refresh if focused AND a user is logged in
  useEffect(() => {
    if (isFocused && currentUser) { 
      fetchTransactions();
    }
  }, [isFocused, currentUser, fetchTransactions]);


  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) {
        console.error('Delete error:', error.message);
      } else {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Unexpected delete error:', err);
    }
  };

  if (isLoading && !isRefreshing) { // Show loading screen only on initial load or if not already refreshing
    return (
      <View style={styles.loadingScreen}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!montserratLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10}}>
        {['All', 'Credit Card', 'Cash'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            onPress={() => setSelectedTab(tab as any)}
            style={[styles.tab, {backgroundColor: selectedTab === tab ? '#D2996C' : '#FFF8F2'}]}
          >  
            <Text style={{
              color: selectedTab === tab ? '#FFFFFF' : '#D2996C', 
              fontFamily: 'Montserrat_700Bold'
            }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* If 'ALL' is selected */}
      {selectedTab === 'All' && (
      <>
      <View style={{flexDirection: 'row', gap: 5, width: '100%'}}>
        <View style={styles.subContainer}>
          <Text style={[styles.title, {textAlign: 'center'}]}>Credit Card Expense</Text>
          <Text style={styles.totalAmount}>${cardExpense}</Text>
        </View>
        <View style={styles.subContainer}>
          <Text style={[styles.title, {textAlign: 'center'}]}>Cash</Text>
          <Text style={[styles.title, {textAlign: 'center'}]}>Expense</Text>
          <Text style={styles.totalAmount}>${cashExpense}</Text>
        </View>
      </View>

      {/* Pie Chart */}
      <PieChart
        data={[
          { name: 'Credit Card', spending: cardExpense, color: '#C6844F', legendFontColor: '#3A2A21', legendFontSize: 12 },
          { name: 'Cash', spending: cashExpense, color: '#D9B08C', legendFontColor: '#3A2A21', legendFontSize: 12 },
        ]}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`,
        }}
        accessor="spending"
        backgroundColor="transparent"
        paddingLeft="16"
        absolute 
      />
      </>
      )}

      {/* If 'Credit Card' is selected */}
      { selectedTab === 'Credit Card' && (
        <View style={{position: 'relative', width: '100%', marginBottom: 20}}>
          <View style={[styles.subContainer,{width: '100%'}]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 20}}>
                <CreditCard cardName='Credit Card 1' cardEnding={4567} cardExpense={1200} cardDueDate='Aug 4, 2025' cardType='Visa' />
                <CreditCard cardName='Credit Card 2' cardEnding={8673} cardExpense={1200} cardDueDate='Aug 4, 2025' cardType='Mastercard' />
                <CreditCard cardName='Credit Card 3' cardEnding={8880} cardExpense={1200} cardDueDate='Aug 4, 2025' cardType='Visa' />
              </View>
            </ScrollView>
          </View>

          <Pressable style={styles.fab} onPress={() => setModalNewCardVisible(true)}>
            <Text style={styles.fabText}>Add Card</Text>
          </Pressable>

          <AddNewCardModal visible={modalNewCardVisible} onClose={() => setModalNewCardVisible(false)} />
        </View>
      )}

      {/* TRANSACTIONS */}
      {transactions.length > 0 ? (
        <SwipeListView
          data={transactions}
          keyExtractor={(item) => item.id}
          extraData={transactions}
          contentContainerStyle={{ paddingBottom: 20 }}
          // Implement pull-to-refresh
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchTransactions}
              tintColor="#000" // Customize spinner color
            />
          }
          renderItem={({ item }) => (
            <View style={{ height: 80, marginVertical: 5 }}>
              <TransactionCard transaction={item} />
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-150}
          disableRightSwipe
        />
      ) : (
        <ScrollView // Use ScrollView to allow RefreshControl when no transactions
          contentContainerStyle={styles.noTransactionsContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchTransactions}
              tintColor="#000"
            />
          }
        >
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No transactions</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    padding: 10,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 40,
    marginVertical: 5,
    height: 75,
    zIndex: -1,
  },
  deleteButton: {
    backgroundColor: '#E65C5C',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noTransactionsContainer: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
  },
  tab: {
    borderWidth: 3,
    borderColor: '#D2996C',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    minHeight: 100,
    borderRadius: 20,
    padding: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#3A2A21', 
    textTransform: 'uppercase',
    lineHeight: 20,
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
  totalAmount: {
    color: '#D2996C',
    fontSize: 30,
    fontFamily: 'Montserrat_700Bold',
  },
  fab: {
    width: 150,
    height: 40,
    position: 'absolute',
    bottom: -12, 
    left: '75%',
    transform: [{ translateX: -75 }], 
    backgroundColor: '#C6844F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
  },
  fabText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 14,
  }
});