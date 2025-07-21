import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BudgetModal({ visible, onClose }: BudgetModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Budget</Text>
            <Text>Help yourself stay on track and reach your goals by setting a limit for this category.</Text>

            {/* Save Button */}
            <Pressable style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF8F5',
    borderColor: '#C6844F',
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#3A2A21',
  },
  input: {
    width: '100%',
    borderColor: '#C3905E',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#C3905E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '65%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});