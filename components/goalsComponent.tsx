import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native"; 
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import AddSavingsModal from "./addAmountModal";

interface Props {
  name: string;
  targetAmount: number;
  startAmount: number;
  targetDate: string;
  onDelete: () => void;
  goalId: string;
  onSaveComplete?: () => void;
}

export default function GoalsCard({ name, targetAmount, startAmount, targetDate, onDelete, goalId, onSaveComplete }: Props) {
  const [montserratLoaded] = useMontserratFonts({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold });
  const [modalAddSavingsVisible, setModalAddSavingsVisible] = useState(false);

  if (!montserratLoaded) return null;

  const savingsProgress = targetAmount > 0 ? Math.min(startAmount / targetAmount, 1) : 0;
  const percentageSaved = savingsProgress * 100;
  const remainingAmount = targetAmount - startAmount;
  const timeLeftText = '2 months left'; 
  const weeklyNeeded = (remainingAmount / 8).toFixed(0); 

  return (
    <View style={styles.container}>
      {/* Title and Delete */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.containerTitle}>{name}</Text>
          <Text style={styles.subTitle}>{targetDate}</Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <MaterialCommunityIcons name="trash-can" size={18} color="#5C4630" />
        </TouchableOpacity>
      </View>

      {/* Saved amount */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text style={[styles.progressAmount, { color: '#5C4630' }]}>${startAmount.toFixed(2)} / ${targetAmount.toFixed(2)}</Text>
        <Text style={[styles.progressAmount, { color: '#C6844F' }]}>{percentageSaved.toFixed(1)}% done</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { flex: percentageSaved }]} />
        <View style={{ flex: 100 - percentageSaved }} />
      </View>

      {/* Timeline + Weekly Need */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.timeText}>{timeLeftText}</Text>
        <Text style={styles.timeText}>${weeklyNeeded}/week needed</Text>
      </View>

      <Pressable style={styles.addSavings} onPress={() => setModalAddSavingsVisible(true)}>
        <Text style={styles.addText}>+ add savings</Text>
      </Pressable>

      <AddSavingsModal 
        visible={modalAddSavingsVisible} 
        onClose={() => setModalAddSavingsVisible(false)} 
        goalId={goalId} 
        onSaveComplete={() => {
          setModalAddSavingsVisible(false);
          onSaveComplete?.();
        }}
      />
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
  },
  subTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#5C4630',
  },
  progressAmount: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    paddingBottom: 2,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#B6A089',
    overflow: 'hidden',
    marginBottom: 8,
    flexDirection: 'row',
    width: '100%',
  },
  progressFill: {
    backgroundColor: '#5C4630',
  },
  timeText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#5C4630',
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
  },
  addText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    fontSize: 12,
  },
});
