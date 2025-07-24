import { StyleSheet, View, Text, Pressable } from "react-native";
import { useFonts as useMontserratFonts, Montserrat_400Regular,Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import AddSavingsModal from "./addAmountModal";
 
type prop = {
    goalTitle: string;
    targetDate: string;
}

export default function GoalsCard({ goalTitle, targetDate } : prop) {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold });

    // Sample data, values might need to be in props
    const amountSaved = 625; 
    const amountSavings = 1000;
    const percentageSaved = 30;
    const currentSavings = 625;
    const savingsGoal = 1000;
    const savingsProgress = savingsGoal > 0 ? Math.min(currentSavings /savingsGoal, 1) : 0;

    // display remaining months, weeks, days
    const timeValue = 2;
    const timeUnit = 'months';
    const amountNeeded = 50;

    const [modalAddSavingsVisible, setModalAddSavingsVisible] = useState(false);

    if (!montserratLoaded) {
      return null;
    }
    return (
        <View style={styles.container}>
            {/* Goal Title, Target Date, and Delete Icon */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <View>
                    <Text style={styles.containerTitle}>{goalTitle}</Text>
                    <Text style={styles.subTitle}>{targetDate}</Text>
                </View>
                <MaterialCommunityIcons 
                    name="trash-can"
                    size={18}
                    color="#5C4630"
                />
            </View>

            {/* Savings Progress Amount */}
            <View style={{ 
                flexDirection: 'row' , 
                    justifyContent: 'space-between', 
                    alignItems:'flex-end',
                    marginVertical: 10,
            }}>
                {/* Amount Saved vs Savings Goals */}
                <Text style={[
                    styles.progressAmount, { 
                    color: '#5C4630'
                }]
                }>
                    ${amountSaved.toFixed(2)} / ${amountSavings.toFixed(2)}
                </Text>
                <Text style={[
                    styles.progressAmount, { 
                    color: '#C6844F'
                }]
                }>
                    {percentageSaved.toFixed(2)}% done
                </Text>
            </View>

            {/* Progress Bar */}
            <View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { flex: (savingsProgress * 100) }]} />
                    <View style={{ flex: 100 - (savingsProgress * 100) }} />
                </View>
            </View>

            {/* Display Remaining Months,Weeks,Days */}
            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Text style={{
                        fontFamily: 'Montserrat_400Regular',
                        fontSize: 12,
                        color: '#5C4630',
                        }}>{timeValue} {timeUnit} left</Text>
                    <Text style={{
                        fontFamily: 'Montserrat_400Regular',
                        fontSize: 12,
                        color: '#5C4630',
                    }}>${amountNeeded}/week needed</Text>
                </View>
            </View>
            
            <Pressable style={styles.addSavings} onPress={() => setModalAddSavingsVisible(true)}>
                <Text style={{
                    fontFamily: 'Montserrat_700Bold',
                    color: '#FFFFFF',
                    fontSize: 12,
                }}>+ add savings</Text>
            </Pressable>

            <AddSavingsModal visible={modalAddSavingsVisible} onClose={() => setModalAddSavingsVisible(false)} />
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
        width: 340,
    },
    containerTitle: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 16,
        color: "#5C4630",
        textTransform: 'uppercase',
        lineHeight: 18,
    },
    subTitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#5C4630',
    },
    progressBar: {
    height: 20, 
    backgroundColor: '#B6A089',
    overflow: 'hidden',
    marginBottom: 8,
    width: '100%',
    flexDirection: 'row',
    },
    progressFill: {
        backgroundColor: '#5C4630',
    },
    progressAmount: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        verticalAlign: 'middle', 
        paddingBottom: 2,
    },
    addSavings: {
        width: '40%',
        height: 30,
        backgroundColor: '#A3C9A8',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 15,
    }
});