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

    const [selected, setSelected] = useState('Daily');

    const options = ['Daily', 'Weekly', 'Monthly'];

    const data = [
    {
      name: 'Food',
      spending: 287,
      color: '#C3905E',
      legendFontColor: '#5A4532',
      legendFontSize: 14,
    },
    {
      name: 'Rent',
      spending: 300,
      color: '#A38970',
      legendFontColor: '#5A4532',
      legendFontSize: 14,
    },
    {
      name: 'Utilities',
      spending: 100,
      color: '#E5D1BA',
      legendFontColor: '#5A4532',
      legendFontSize: 14,
    },
  ];

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
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              data: [30, 45, 28, 80, 99],
              strokeWidth: 2, // optional
            },
          ],
          }}
        width={screenWidth - 60}
        height={220}
        chartConfig={{
          backgroundColor: '#fef8f2',
          backgroundGradientFrom: '#fef8f2',
          backgroundGradientTo: '#fef8f2',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`, 
          labelColor: (opacity = 1) => `rgba(90, 69, 50, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#B7A690',
          },
        }}
        bezier // optional: makes it a smooth curve
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginHorizontal: 0,
        }}
      />

      <View>
      <PieChart
        data={data}
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
});
