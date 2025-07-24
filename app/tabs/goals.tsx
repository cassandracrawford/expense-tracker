import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import BudgetCard from '../../components/budgetComponent';
import GoalsCard from '@/components/goalsComponent';
import BudgetModal from '@/components/addBudgetModal';
import SavingsModal from '@/components/addSavingsModal';

export default function GoalScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});

    const router = useRouter();

    const totalBudget = 2450;
    const totalAmountSpent = 2000;
    const progress = totalBudget > 0 ? Math.min(totalAmountSpent / totalBudget, 1) : 0;

    const totalSavings = 3000;
    const totalSavingsGoal = 10000;
    const savingsProgress = totalSavingsGoal > 0 ? Math.min(totalSavings /totalSavingsGoal, 1) : 0;

    const [modalBudgetVisible, setModalBudgetVisible] = useState(false);
    const [modalSavingsVisible, setModalSavingsVisible] = useState(false);

    const activeGoals = 4;

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Total Budget Progress */}
            <View style={styles.subContainer}>
              <View style={{ 
                flexDirection: 'row' , 
                justifyContent: 'space-between', 
                alignItems:'flex-end',
                marginBottom: 10,
              }}>
                <Text style={styles.containerTitle}>Total Budget</Text>

                {/* Total Amount Spent vs Total Budget */}
                <Text style={[styles.containterSubTitle, { 
                  verticalAlign: 'middle', 
                  paddingBottom: 2}]
                }>
                  ${totalAmountSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { flex: (progress * 100) }]} />
                <View style={{ flex: 100 - (progress * 100) }} />
              </View>

              <Text style={styles.containterSubTitle}>Total budget set this month.</Text>
            </View>

            {/* Total Savings Progress */}
            <View style={[styles.subContainer, {
              marginBottom: 20,}]
            }>
              <View style={{ 
                flexDirection: 'row' , 
                justifyContent: 'space-between', 
                alignItems:'flex-end',
                marginBottom: 10, 
              }}>
                <Text style={styles.containerTitle}>Total Savings</Text>

                {/* Total Amount Saved vs Total Savings Goal */}
                <Text style={[styles.containterSubTitle, { 
                  verticalAlign: 'middle', paddingBottom: 2}]}>${totalSavings.toFixed(2)} / ${totalSavingsGoal.toFixed(2)}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { flex: (savingsProgress * 100) }]} />
                <View style={{ flex: 100 - (savingsProgress * 100) }} />
              </View>

              <Text style={styles.containterSubTitle}>{activeGoals} active goals.</Text>
            </View>

            {/* Monthly Budget */}
            <View style={{
              position: 'relative', 
              marginBottom: 10,
            }}>
              <Pressable style={styles.fab} onPress={() => setModalBudgetVisible(true)}>
                <Text style={styles.fabText}>+ Add Budget</Text>
              </Pressable>

              <BudgetModal visible={modalBudgetVisible} onClose={() => setModalBudgetVisible(false)} />

              <View style={styles.subContainer}>
                  <Text style={styles.containerTitle}>Monthly Budget</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 20}}>
                      <BudgetCard category='Grocery' icon='basket' spentBudget={650} categoryBudget={1000}/>
                      <BudgetCard category='Utilities' icon='lightbulb' spentBudget={400} categoryBudget={450}/>
                      <BudgetCard category='Rent' icon='home' spentBudget={1800} categoryBudget={2000}/>
                    </View>
                  </ScrollView>
              </View>
            </View>

            {/* Savings Goals */}
            <View style={{position: 'relative'}}>
              <Pressable style={styles.fab} onPress={() => setModalSavingsVisible(true)}>
                <Text style={styles.fabText}>+ Add Goal</Text>
              </Pressable>

              <SavingsModal visible={modalSavingsVisible} onClose={() => setModalSavingsVisible(false)} />
              <View style={styles.subContainer}>
                <Text style={styles.containerTitle}>Savings Goals</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 20}}>
                      <GoalsCard goalTitle='Iphone 16 Pro Max' targetDate='Aug 2025' />
                      <GoalsCard goalTitle='Iphone 16 Pro Max' targetDate='Aug 2025' />
                      <GoalsCard goalTitle='Iphone 16 Pro Max' targetDate='Aug 2025' />
                    </View>
                  </ScrollView>
              </View>
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
  containterSubTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    color: '#5C4630',
  },
  progressBar: {
    height: 20, 
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 8,
    width: '100%',
    flexDirection: 'row',
  },
  progressFill: {
    backgroundColor: '#C6844F',
  },
  fab: {
    width: 150,
    height: 40,
    position: 'absolute',
    top: -10, 
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
