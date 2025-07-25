// ✅ 完整整合：GoalScreen (goals.tsx)
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useState } from 'react';
import BudgetCard from '../../components/budgetComponent';
import GoalsCard from '@/components/goalsComponent';
import BudgetModal from '@/components/addBudgetModal';
import SavingsModal from '@/components/addSavingsModal';
import { useUserGoalData } from '@/hooks/useUserGoalData';
import supabase from '@/lib/supabase';

export default function GoalScreen() {
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_500Medium,
  });

  const [opensansLoaded] = useOpenSansFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const [modalBudgetVisible, setModalBudgetVisible] = useState(false);
  const [modalSavingsVisible, setModalSavingsVisible] = useState(false);

  const {
    totalBudget,
    totalSpent,
    totalSavings,
    totalSavingsGoal,
    activeGoalsCount,
    goalList,
    refresh,
  } = useUserGoalData();

  const budgetProgress = totalBudget > 0 ? Math.min(totalSpent / totalBudget, 1) : 0;
  const savingsProgress = totalSavingsGoal > 0 ? Math.min(totalSavings / totalSavingsGoal, 1) : 0;

  const handleDeleteGoal = async (id: string) => {
    console.log('🗑️ Try deleting goal:', id);
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete goal:', error.message);
    } else {
      console.log('Goal deleted');
      await refresh();
    }
  };

  if (!montserratLoaded || !opensansLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      {/* 💰 Total Budget Section */}
      <View style={styles.subContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.containerTitle}>Total Budget</Text>
          <Text style={styles.containterSubTitle}>${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: budgetProgress * 100 }]} />
          <View style={{ flex: 100 - budgetProgress * 100 }} />
        </View>
        <Text style={styles.containterSubTitle}>Total budget set this month.</Text>
      </View>

      {/* 🏦 Total Savings Section */}
      <View style={[styles.subContainer, { marginBottom: 20 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.containerTitle}>Total Savings</Text>
          <Text style={styles.containterSubTitle}>${totalSavings.toFixed(2)} / ${totalSavingsGoal.toFixed(2)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: savingsProgress * 100 }]} />
          <View style={{ flex: 100 - savingsProgress * 100 }} />
        </View>
        <Text style={styles.containterSubTitle}>{activeGoalsCount} active goals.</Text>
      </View>

      {/* 📊 Monthly Budget Card */}
      <View style={{ position: 'relative', marginBottom: 10 }}>
        <Pressable style={styles.fab} onPress={() => setModalBudgetVisible(true)}>
          <Text style={styles.fabText}>+ Add Budget</Text>
        </Pressable>
        <BudgetModal visible={modalBudgetVisible} onClose={() => setModalBudgetVisible(false)} />

        <View style={styles.subContainer}>
          <Text style={styles.containerTitle}>Monthly Budget</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <BudgetCard category="Grocery" icon="basket" spentBudget={650} categoryBudget={1000} />
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 🎯 Savings Goals */}
      <View style={{ position: 'relative' }}>
        <Pressable style={styles.fab} onPress={() => setModalSavingsVisible(true)}>
          <Text style={styles.fabText}>+ Add Goal</Text>
        </Pressable>
        <SavingsModal
          visible={modalSavingsVisible}
          onClose={() => setModalSavingsVisible(false)}
          onSaveComplete={refresh}
        />

        <View style={styles.subContainer}>
          <Text style={styles.containerTitle}>Savings Goals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              {goalList.map((goal) => (
                <GoalsCard
                  key={goal.id}
                  name={goal.name}
                  targetAmount={goal.target_amount}
                  startAmount={goal.start_amount}
                  targetDate={goal.target_date}
                  onDelete={() => handleDeleteGoal(goal.id)} // ✅ 這裡確保 onDelete 有傳進去
                />
              ))}
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
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
  },
  containerTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#3A2A21',
    textTransform: 'uppercase',
  },
  containterSubTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    color: '#5C4630',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressFill: {
    backgroundColor: '#C6844F',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  fab: {
    width: 150,
    height: 40,
    position: 'absolute',
    top: -10,
    left: '75%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#C6844F',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fabText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});
