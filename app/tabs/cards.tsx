import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import {
  useFonts as useMontserratFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_400Regular_Italic,
} from "@expo-google-fonts/montserrat";
import { useEffect, useState, useCallback } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import supabase from "@/lib/supabase";
import TransactionCard from "@/components/transactionCard";
import { User } from "@supabase/supabase-js";
import { useIsFocused } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import CreditCard from "@/components/cardComponent";
import AddNewCardModal from "@/components/addNewCardModal";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Alert } from "react-native";
import { useRef } from "react";

const screenWidth = Dimensions.get("window").width;

export default function CardsScreen() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_400Regular_Italic,
  });

  type Transaction = {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    description?: string;
    payment_method: string;
    date: Date;
    card_id?: string;
    type: "income" | "expense";
  };

  type Card = {
    id: string;
    user_id: string;
    name: string;
    number: string;
    balance: number;
    spending_limit: number;
    due_date: string;
    type: string;
  };
  type TabType = "All" | "Credit Card" | "Cash";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>("All");
  const isFocused = useIsFocused();
  const [modalNewCardVisible, setModalNewCardVisible] = useState(false);
  const cardWidth = screenWidth * 0.9;

  const sidePadding = (screenWidth - cardWidth) / 2;

  const flatListRef = useRef<FlatList<Card>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    const card = cards[index];
    if (card) {
      setSelectedCardId(card.id);
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("date", { ascending: false });
    if (error) console.error("Transaction fetch error:", error.message);
    setTransactions(data ?? []);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [currentUser]);

  const fetchCards = useCallback(async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", currentUser.id);
    if (error) console.error("Card fetch error:", error.message);
    setCards(data ?? []);
  }, [currentUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) setCurrentUser(session.user);
      else {
        setCurrentUser(null);
        setTransactions([]);
        setCards([]);
        setIsLoading(false);
      }
    });
    const checkInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session?.user) setCurrentUser(session.user);
      else setIsLoading(false);
    };
    checkInitialSession();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
      fetchCards();
    }
  }, [currentUser, fetchTransactions, fetchCards]);

  useEffect(() => {
    if (isFocused && currentUser) {
      fetchTransactions();
      fetchCards();
    }
  }, [isFocused, currentUser, fetchTransactions, fetchCards]);

  // Note: In future development, current card balance or initial balance will be stored in the DB
  // and will be included in the total credit card expenses. For now, only recorded transactions are considered.
  const cardTotal = transactions
    .filter((t) => t.card_id && t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cashTotal = transactions
    .filter(
      (t) => !t.card_id && t.payment_method === "Cash" && t.type === "expense"
    )
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const displayedTransactions = transactions.filter((t) => {
    if (t.type !== "expense") return false;
    if (selectedTab === "All") return true;
    if (selectedTab === "Cash") return t.payment_method === "Cash";
    if (selectedTab === "Credit Card" && selectedCardId)
      return t.card_id === selectedCardId;
    return false;
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  if (!montserratLoaded || (isLoading && !isRefreshing)) {
    return (
      <View style={styles.loadingScreen}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const hasExpense = transactions.some((t) => t.type === "expense");

  const handleDeleteCard = (cardId: string, cardName: string) => {
    Alert.alert(
      "Delete Card",
      `Are you sure you want to delete the card "${cardName}"?\n\nAll associated transactions will also be deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error: txError } = await supabase
                .from("transactions")
                .delete()
                .eq("card_id", cardId);

              if (txError) {
                console.error(
                  "Failed to delete transactions:",
                  txError.message
                );
                Alert.alert("Error", "Failed to delete related transactions.");
                return;
              }

              const { error: cardError } = await supabase
                .from("cards")
                .delete()
                .eq("id", cardId);

              if (cardError) {
                console.error("Failed to delete card:", cardError.message);
                Alert.alert("Error", "Failed to delete card.");
                return;
              }

              await fetchCards();
              await fetchTransactions();
              setSelectedCardId(null);

              Alert.alert(
                "Deleted",
                `Card "${cardName}" and related data were removed.`
              );
            } catch (err) {
              console.error("Unexpected error:", err);
              Alert.alert("Error", "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 30, marginBottom: 10 }}>
        {(["All", "Credit Card", "Cash"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setSelectedTab(tab); // properly updates the tab

              if (tab === "Credit Card" && cards.length > 0) {
                setSelectedCardId(cards[0].id);
                flatListRef.current?.scrollToIndex({
                  index: 0,
                  animated: true,
                });
              } else {
                setSelectedCardId(null);
              }
            }}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === tab ? "#D2996C" : "#FFF8F2" },
            ]}
          >
            <Text
              style={{
                color: selectedTab === tab ? "#FFFFFF" : "#D2996C",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === "All" && (
        <>
          {cardTotal + cashTotal > 0 ? (
            <>
              <View style={{ flexDirection: "row", gap: 5, width: "100%" }}>
                <View style={styles.subContainer}>
                  <Text style={[styles.title, { textAlign: "center" }]}>
                    Credit Card Expense
                  </Text>
                  <Text style={styles.totalAmount}>
                    ${cardTotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.subContainer}>
                  <Text style={[styles.title, { textAlign: "center" }]}>
                    Cash{"\n"}Expense
                  </Text>
                  <Text style={styles.totalAmount}>
                    ${cashTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              <PieChart
                data={[
                  {
                    name: "Credit Card",
                    spending: cardTotal,
                    color: "#C6844F",
                    legendFontColor: "#3A2A21",
                    legendFontSize: 12,
                  },
                  {
                    name: `Cash`,
                    spending: cashTotal,
                    color: "#D9B08C",
                    legendFontColor: "#3A2A21",
                    legendFontSize: 12,
                  },
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
          ) : (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Montserrat_700Bold",
                  fontSize: 16,
                  color: "#3A2A21",
                  textAlign: "center",
                  backgroundColor: "#FFF8F2",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                Add a transaction to see your chart.
              </Text>
            </View>
          )}
        </>
      )}
      {selectedTab === "Credit Card" && (
        <View style={[styles.cardContainer, { marginBottom: 40 }]}>
          {cards.length > 0 ? (
            <FlatList
              data={cards}
              ref={flatListRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
              }}
              snapToAlignment="center"
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: screenWidth - 32,
                offset: (screenWidth - 32) * index,
                index,
              })}
              renderItem={({ item }) => {
                const total = item.balance + transactions
                  .filter((t) => t.card_id === item.id && t.type === "expense")
                  .reduce((sum, t) => sum + Number(t.amount), 0);
                return (
                  <View style={styles.cardWrapper}>
                    <CreditCard
                      cardName={item.name}
                      cardEnding={parseInt(item.number.slice(-4))}
                      cardExpense={total}
                      cardDueDate={item.due_date}
                      cardType={item.type}
                      onDelete={() => handleDeleteCard(item.id, item.name)}
                    />
                  </View>
                );
              }}
            />
          ) : (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text
                style={{
                  fontFamily: "Montserrat_700Bold",
                  fontSize: 16,
                  color: "#3A2A21",
                  textAlign: "center",
                  // backgroundColor: '#FFF8F2',
                  // paddingHorizontal: 20,
                  // paddingVertical: 10,
                  // borderRadius: 12,
                  // shadowColor: '#000',
                  // shadowOffset: { width: 0, height: 1 },
                  // shadowOpacity: 0.1,
                  // shadowRadius: 3,
                  // elevation: 2
                }}
              >
                No cards added.
              </Text>
            </View>
          )}

          <Pressable
            style={styles.fab}
            onPress={() => setModalNewCardVisible(true)}
          >
            <Text style={styles.fabText}>Add Card</Text>
          </Pressable>

          <AddNewCardModal
            visible={modalNewCardVisible}
            onClose={async () => {
              setModalNewCardVisible(false);
              await fetchCards(); // Refresh card list
              await fetchTransactions(); // Refresh transactions for the new card

              // Scroll to and select the newest card
              if (cards.length > 0) {
                const latestCard = cards[cards.length - 1];
                setSelectedCardId(latestCard.id);
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: cards.length - 1,
                    animated: true,
                  });
                }, 300);
              }
            }}
          />
        </View>
      )}
      {selectedTab === "Cash" && cashTotal === 0 && (
        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 16,
              color: "#3A2A21",
              textAlign: "center",
              backgroundColor: "#FFF8F2",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            No cash transactions.
          </Text>
        </View>
      )}
      <SwipeListView
        data={displayedTransactions}
        keyExtractor={(item) => item.id}
        extraData={transactions}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchTransactions}
            tintColor="#000"
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
    padding: 10,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#FFF8F2",
    justifyContent: "center",
    alignItems: "center",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 40,
    marginVertical: 5,
    height: 75,
    zIndex: -1,
  },
  deleteButton: {
    backgroundColor: "#E65C5C",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  noTransactionsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F2",
  },
  tab: {
    borderWidth: 3,
    borderColor: "#D2996C",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  subContainer: {
    backgroundColor: "#F5E5DC",
    marginVertical: 8,
    minHeight: 100,
    borderRadius: 20,
    padding: 20,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#3A2A21",
    textTransform: "uppercase",
    lineHeight: 20,
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  totalAmount: {
    color: "#D2996C",
    fontSize: 30,
    fontFamily: "Montserrat_700Bold",
  },
  fab: {
    width: 150,
    height: 40,
    position: "absolute",
    bottom: -12,
    right: "-15%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#C6844F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 3,
  },
  fabText: {
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  cardWrapper: {
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardContainer: {
    backgroundColor: "#F5E5DC",
    borderRadius: 20,
    padding: 20,
    minHeight: 100,
    marginTop: 10,
  },
});
