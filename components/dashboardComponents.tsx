import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useUserFinanceData } from '../hooks/useUserFinanceData';
import Svg, { G, Circle } from 'react-native-svg';
import TransactionList from './TransactionList'; 

const screenWidth = Dimensions.get('window').width;

export default function DashboardComponents() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const { totalBudget, totalSpent, percentageUsed, transactions, refresh } = useUserFinanceData(); 

  if (!montserratLoaded) {
    return null;
  }

  return (
    <View style={{ padding: 15 }}>
      <Text style={styles.headerText}>Hello, Andy!</Text>

      <View style={styles.budgetContainer}>
        <DonutChart percentage={percentageUsed} />
        <View style={styles.budgetTextContainer}>
          <View style={styles.row}>
            <View style={[styles.colorBox, { backgroundColor: '#B7A690' }]} />
            <Text style={styles.budgetLabel}>Total Budget</Text>
            <Text style={styles.budgetAmount}>${totalBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.colorBox, { backgroundColor: '#5A4532' }]} />
            <Text style={styles.budgetLabel}>Total Spent</Text>
            <Text style={styles.budgetAmount}>${totalSpent.toLocaleString()}</Text>
          </View>
          <Text style={styles.viewBreakdown}>View Breakdown</Text>
        </View>
      </View>

      <Text style={[styles.transactionsTitle, { marginTop: 15 }]}>Recent Transactions</Text>

      <TransactionList transactions={transactions} onDeleteComplete={refresh} />
    </View>
  );
}

export function DonutChart({
  percentage = 0,
  size = 200,
  strokeWidth = 40,
  colorDark = '#5A4532',
  colorLight = '#B7A690',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percent = Math.min(Math.max(percentage, 0), 1) * 100;
  const darkLength = (percent / 100) * circumference;
  const lightLength = circumference - darkLength;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorDark}
            strokeWidth={strokeWidth}
            strokeDasharray={`${darkLength}, ${circumference}`}
            strokeLinecap="butt"
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorLight}
            strokeWidth={strokeWidth}
            strokeDasharray={`${lightLength}, ${circumference}`}
            strokeDashoffset={-darkLength}
            strokeLinecap="butt"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: '#3A2A21',
    marginBottom: 20,
  },
  budgetContainer: {
    backgroundColor: '#F8EDE3',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  budgetLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#5C4630',
    marginRight: 10,
  },
  budgetAmount: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: '#5C4630',
  },
  viewBreakdown: {
    marginTop: 10,
    color: '#C47B3E',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat_500Medium',
  },
  transactionsTitle: {
    fontFamily: 'Montserrat_700Bold',
    color: '#3A2A21',
    fontSize: 16,
  },
});
