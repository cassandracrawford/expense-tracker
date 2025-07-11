import { Text, View, StyleSheet, Dimensions} from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular,Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { G, Circle } from 'react-native-svg';

interface TransactionItem {
  id: string;
  icon?: string;
  type: string;
  date: string;
  amount: number;
  isIncome: boolean;
}

interface TransactionsProps {
  transactions: TransactionItem[];
}

const screenWidth = Dimensions.get('window').width;

export default function TransactionList({transactions} : TransactionsProps) {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold });
    
    if (!montserratLoaded) {
      return null;
    }
      
    return (
      <>
        {transactions.length === 0 ? (
          <View style={{padding: 15}}>
            <Text style={styles.transactionsTitle}>No Recent Transactions</Text>
            <Text style={styles.transactionsSubtitle}>Your recent transactions will show here.</Text>
          </View>
        ) :(
          transactions.map((item: TransactionItem) => (
            <View key={item.id} style={styles.transactionsRow}>
              <MaterialCommunityIcons 
                name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={24}
                color="#5C4630"
                style={{marginRight: 10}}
              />
              <View style={{flex: 1}}>
                <Text style={styles.transactionsTitle}>{item.type}</Text>
                <Text style={styles.transactionsSubtitle}>{item.date}</Text>
              </View>
              <Text style={styles.amountStyle}>{item.isIncome ? '+' : '-'} ${item.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </>
    );
}

export function ReminderCard() {
  return(
    <View style={styles.cardReminders}>
      <Text style={styles.remindersTextTitle}>No Reminders</Text>
      <Text style={styles.remindersSubTitle}>Due Today</Text>
    </View>
  );
}

export function DonutChart({
  percentage = 0,
  size = 250,
  strokeWidth = 60,
  colorDark = '#5A4532',
  colorLight = '#B7A690',
  }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const darkPercent = percentage;
  const lightPercent = 100 - darkPercent;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Dark portion */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorDark}
            strokeWidth={strokeWidth}
            strokeDasharray={`${(darkPercent / 100) * circumference}, ${circumference}`}
            strokeLinecap="butt"
            fill="none"
          />
          {/* Light portion */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorLight}
            strokeWidth={strokeWidth}
            strokeDasharray={`${(lightPercent / 100) * circumference}, ${circumference}`}
            strokeDashoffset={(darkPercent / 100) * circumference * -1}
            strokeLinecap="butt"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsTitle: {
    fontFamily: 'Montserrat_500Medium',
    color: '#3A2A21',
    fontSize: 16,
  },
  transactionsSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#5C4630',
    fontSize: 14,
    fontStyle: 'italic',
  },
  transactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  amountStyle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: '#5C4630',
  },
    cardReminders: {
    height: 75,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 10,
    padding:  15,
    justifyContent: 'center',
  },
  remindersTextTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#5C4630',
  },
  remindersSubTitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#5C4630',
  },
  innerCircle: {
    position: 'absolute',
    top: 90,
    left: (screenWidth - 40) / 2 - 35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
