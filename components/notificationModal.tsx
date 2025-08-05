import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import supabase from "@/lib/supabase";
import { Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  userId: string | null;
}

interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationPanel({ isVisible, onClose, userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error.message);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };
    const markAllAsRead = async () => {
    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

    if (error) {
        console.error("Error marking notifications as read:", error.message);
    }
    };

    useEffect(() => {
    if (isVisible && userId) {
        fetchNotifications();
        markAllAsRead();
    }
    }, [isVisible, userId]);

    const clearAllNotifications = async () => {
    const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

    if (error) {
        console.error("Error clearing notifications:", error.message);
    } else {
        setNotifications([]);
    }
    };


  return (
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
          {loading ? (
            <ActivityIndicator size="small" color="#C6844F" />
          ) : notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications</Text>
          ) : (
            <ScrollView style={{ minHeight: 400 }}>
              {notifications.map((notif) => (
                <View key={notif.id} style={styles.card}>
                  <Text style={styles.cardText}>{notif.message}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          {notifications.length > 0 && (
            <View style={styles.clearAllContainer}>
                <Text style={styles.clearAll} onPress={clearAllNotifications}>
                Clear All
                </Text>
            </View>
            )}

        </View>
        <Text style={styles.footer}>Swipe Up</Text>
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
    backgroundColor: "#FFF8F2",
    flex: 1,
    paddingVertical: 100,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  heading: {
    color: "#3A2A21",
    textTransform: "uppercase",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#D2996C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  emptyText: {
    color: "#3A2A21",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    color: "#D2996C",
    fontFamily: "Montserrat_700Bold",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
},
clearAllContainer: {
  alignItems: 'flex-end',
  marginTop: 10,
},

clearAll: {
  fontFamily: 'Montserrat_700Bold',
  fontSize: 14,
  color: '#D9534F',
  textDecorationLine: 'underline',
},


});
