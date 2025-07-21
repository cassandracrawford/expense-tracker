import { StyleSheet, View, Text, Dimensions} from "react-native";
import { useFonts as useMontserratFonts, Montserrat_400Regular,Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DonutChart } from './dashboardComponents';

type prop ={
    category: string;
    icon?: string;
    spentBudget: number;
    categoryBudget: number;
}
export default function BudgetCard({category, icon, spentBudget, categoryBudget}: prop) {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold });

    const screenWidth = Dimensions.get('window').width;

    const spent = spentBudget;
    const total = categoryBudget;
    const percent = Math.round((spent / total) * 100);
    const remaining = total - spent;
    
    if (!montserratLoaded) {
      return null;
    }
    return(
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 20}}>
                    <MaterialCommunityIcons 
                    name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={18}
                    color="#5C4630"
                    style={{marginRight: 5}}
                    />
                    <Text style={styles.containerTitle}>{category}</Text>
                </View>
                <MaterialCommunityIcons 
                    name="trash-can"
                    size={18}
                    color="#5C4630"
                />
            </View>

            {/* Donut Chart */}
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                <DonutChart percentage={percent} size={120} strokeWidth={30} />

                <Text
                    style={{
                        position: 'absolute',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#5A4532',
                    }}
                >
                {percent}%
                </Text>
            </View>

            {/* spent vs budget */}
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#5A4532', marginTop: 8 }}>
                ${spent} / ${total}
            </Text>

            {/* remaining from budget */}
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#C6844F' }}>
                ${remaining} left
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    width: 250,
    },
    containerTitle: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 16,
        color: "#5C4630",
        textTransform: 'uppercase',
        lineHeight: 18,
    },
});