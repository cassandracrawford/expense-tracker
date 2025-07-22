import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  currentFullName: string;
  currentEmail: string;
  onSave: (newName: string, newEmail: string) => void;
}

export default function EditProfile({ visible, onClose, currentFullName, currentEmail, onSave }: EditProfileProps) {
    const [montserratLoaded] = useMontserratFonts({Montserrat_700Bold, Montserrat_500Medium});

    const [name, setName] = useState(currentFullName);
    const [email, setEmail] = useState(currentEmail);

    useEffect(() => {
        if (visible) {
            setName(currentFullName);
            setEmail(currentEmail);
        }
    }, [visible, currentFullName, currentEmail]);

    //  Load Fonts
    if (!montserratLoaded) {
        return null;
    }

    return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.subContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                    style={[styles.input, {marginBottom: 5}]}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Save Button */}
            <Pressable style={[styles.button, {backgroundColor: '#C6844F'}]} onPress={() => onSave(name?.trim() ?? '', email?.trim() ?? '')}>
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable style={[styles.button, {borderWidth: 3, borderColor: '#C6844F'}]} onPress={onClose}>
                <Text style={[styles.buttonText, {color: '#C6844F'}]}>Cancel</Text>
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
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#3A2A21',
  },
  subContainer: {
    backgroundColor: '#F5E5DC',
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderColor: '#D6C4B2',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#5C4630',
  },
  label: {
    color: '#5C4630',
    fontFamily: 'Montserrat_500Medium',
    paddingVertical: 2,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '65%',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
  },
});