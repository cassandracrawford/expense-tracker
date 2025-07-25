import { Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isVisible, onClose }: Props){
    return(
        <Modal
            isVisible={isVisible}
            swipeDirection="up"
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.overlay}>
                <View>
                <Text style={styles.heading}>Notifications</Text>
                <View style={styles.card}>
                    <Text style={styles.cardText}>You’ve reached 80% of your Food budget.</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardText}>Daily Summary: You logged $ 356.21 in expenses today -- Dining and Transport were your top categories.</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardText}>Reminder: Log your expenses</Text>
                </View>
                 <View style={styles.card}>
                    <Text style={styles.cardText}>Weekly Summary: You spent $ 1,890.50 this week, which is $62 more than last week. Most of your expenses were in food, bills, and shopping, making up 72% of your total spending.</Text>
                </View>
                </View>
                <Text style={{
                    color: '#D2996C', 
                    fontFamily: 'Montserrat_700Bold', 
                    textDecorationLine: 'underline', 
                    textAlign: 'center'
                }}>
                    Swipe Up
                </Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
    }, 
    overlay: {
        backgroundColor: '#FFF8F2',
        flex: 1,
        paddingVertical: 100,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    heading: {
        color: '#3A2A21',
        textTransform: 'uppercase',
        fontFamily: 'Montserrat_700Bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#D2996C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 8,
    },
    cardText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
    }
})