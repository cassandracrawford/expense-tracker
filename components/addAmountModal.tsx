import { Modal, Pressable, StyleSheet, View, Text, TextInput } from "react-native";

interface AddSavingsModalProps {
  visible: boolean;
  onClose: () => void;

}

export default function AddSavingsModal({ visible, onClose }: AddSavingsModalProps) {
    return(
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Pressable style={styles.amountButton}>
                            <Text style={styles.amountText}>$10</Text>
                        </Pressable>
                        <Pressable style={styles.amountButton}>
                            <Text style={styles.amountText}>$20</Text>
                        </Pressable>
                        <Pressable style={styles.amountButton}>
                            <Text style={styles.amountText}>$50</Text>
                        </Pressable>
                        <Pressable style={styles.amountButton}>
                            <Text style={styles.amountText}>$100</Text>
                        </Pressable>
                    </View>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <View style={{justifyContent: 'center'}}>
                        <Text style={{
                            color: '#A3C9A8',
                            fontWeight: 'bold',
                            fontSize: 18
                        }}>
                            Custom Amount:
                        </Text>
                        </View>
                        <View style={{flex: 1, marginLeft: 10}}>
                        <View style={styles.inputWrapper}>
                            <Text style={{fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#A3C9A8'}}>$</Text>
                            <TextInput 
                                style={[styles.input]}
                                placeholder='0.00'
                                placeholderTextColor='#A3C9A8'
                                keyboardType="numeric"
                                // value={name}
                                // onChangeText={setName}
                                />
                        </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Pressable style={[styles.button, {backgroundColor: '#A3C9A8', borderWidth: 2, borderColor:'#A3C9A8'}]}>
                            <Text style={[styles.buttonText,{color: '#FFFFFF'}]}>Enter</Text>
                        </Pressable>
                        <Pressable style={[styles.button, {borderWidth: 2, borderColor:'#A3C9A8'}]} onPress={onClose}>
                            <Text style={[styles.buttonText,{color: '#A3C9A8'}]}>Cancel</Text>
                        </Pressable>
                    </View>
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
    borderColor: '#A3C9A8',
    borderWidth: 3,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  amountButton: {
    backgroundColor: '#A3C9A8',
    borderRadius: 8,
    padding: 15,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    paddingVertical: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal:10,
    
  },
  input: {
    color: '#A3C9A8',
    fontSize: 14,
    fontWeight: 'bold'
  },
});