import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { PieChart } from 'react-native-chart-kit';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function ReportScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});
   
    type TimeOption = 'Daily' | 'Weekly' | 'Monthly';
    const [selected, setSelected] = useState<TimeOption>('Daily');
    const options: TimeOption[] = ['Daily', 'Weekly', 'Monthly'];

    const chartData: Record<TimeOption, number[]> = {
      Daily: [30, 45, 28, 80, 99, 75, 43],
      Weekly: [120, 150, 130, 170, 200, 180, 160],
      Monthly: [400, 380, 420, 460, 500, 520, 540],
    };

    const labels: Record<TimeOption, string[]> = {
      Daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      Monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    };

    const spentTotals = {
      Daily: 99,
      Weekly: 200,
      Monthly: 1200,
    };

    // Sample Data
    const pieData = {
      Daily: [
        { name: 'Dining', spending: 40, color: '#D2996C', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Transport', spending: 30, color: '#DAB9A7', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Groceries', spending: 20, color: '#FDB892', legendFontColor: '#3A2A21', legendFontSize: 12 },
      ],
      Weekly: [
        { name: 'Dining', spending: 120, color: '#D2996C', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Transport', spending: 80, color: '#DAB9A7', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Groceries', spending: 60, color: '#FDB892', legendFontColor: '#3A2A21', legendFontSize: 12 },
      ],
      Monthly: [
        { name: 'Dining', spending: 400, color: '#D2996C', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Transport', spending: 300, color: '#DAB9A7', legendFontColor: '#3A2A21', legendFontSize: 12 },
        { name: 'Groceries', spending: 250, color: '#FDB892', legendFontColor: '#3A2A21', legendFontSize: 12 },
      ],
    };

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    return (
      <View style={styles.container}>
        
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
          labels: labels[selected],
          datasets: [{ data: chartData[selected], strokeWidth: 2 }],
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
        }]}>${spentTotals[selected]}</Text>
      </View>
      <View style={styles.subContainer}>
        {/* Top Categories */}
        <View style={{ flexDirection: 'row', gap: 10}}>
          <Text style={[styles.text,{color: '#3A2A21', fontSize: 16, paddingVertical: 5}]}>Top Categories:</Text>
          <Text style={styles.category}>Dining</Text>
          <Text style={styles.category}>Transportation</Text>
        </View>
        <PieChart
          data={pieData[selected]}
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
      </View>
    </View>
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
