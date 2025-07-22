import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'; // Import RefreshControl and ScrollView
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat';
import { useEffect, useState, useCallback } from 'react'; 
import { SwipeListView } from 'react-native-swipe-list-view';
import supabase from '@/lib/supabase';
import TransactionCard from '@/components/transactionCard';
import { User } from '@supabase/supabase-js'; 
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
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

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Define fetchTransactions using useCallback to prevent unnecessary re-creations
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
      setIsRefreshing(false); // Stop refreshing indicator
    }
  }, [currentUser]); 

  // Effect to listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          // When session is established, fetch transactions
          // fetchTransactions will be called by the other useEffect
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
  }, [currentUser, fetchTransactions]); // Added fetchTransactions to dependencies

  // Effect to refresh data when screen comes into focus
  useEffect(() => {
    if (isFocused && currentUser) { // Only refresh if focused AND a user is logged in
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
});