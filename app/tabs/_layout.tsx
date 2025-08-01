import { Tabs, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, View, Pressable, Text } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import NotificationPanel from '@/components/notificationModal';
import NotificationBell from '@/components/notificationbell';
import supabase from '@/lib/supabase';


export default function TabsLayout() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold
  });

  const [isNotifVisible, setNotifVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const user = await supabase.auth.getUser();
      setUserId(user.data?.user?.id || null);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      if (url.includes('auth/callback')) {
        console.log('Auth callback received:', url);
        router.replace('/tabs');
      }
    });

    return () => sub.remove();
  }, []);

  if (!montserratLoaded) {
    return null;
  }

  const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    index: 'home',
    goals: 'wallet',
    report: 'chart-box',
    settings: 'cog',
  };

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#5C4630',
          tabBarInactiveTintColor: '#B6A089',
          tabBarStyle: {
            backgroundColor: '#FFF8F2',
            borderTopWidth: 0,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#FFF8F2',
            elevation: 0,
            shadowOpacity: 0,
            height: 85,
          },
          headerTitle: '',
          headerRight: () => (
            userId ? (
              <NotificationBell userId={userId} onPress={() => setNotifVisible(true)} />
            ) : (
              <Pressable onPress={() => setNotifVisible(true)} style={{ marginRight: 16 }}>
                <MaterialCommunityIcons name="bell" size={20} color="#C6844F" />
              </Pressable>
            )
          ),
          tabBarIcon: ({ color }) =>
            route.name === 'add' ? null : (
              <MaterialCommunityIcons
                name={icons[route.name] || 'circle'}
                size={28}
                color={color}
              />
            ),
        })}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="goals" />

        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowOverlay(true)}
              >
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen name="report" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="cards" options={{ href: null }} />
        <Tabs.Screen name="budget" options={{ href: null }} />
        <Tabs.Screen name="add-income" options={{ href: null }} />
        <Tabs.Screen name="add-expense" options={{ href: null }} />
      </Tabs>
      
      {/* Notification Component */}
      <NotificationPanel
        isVisible={isNotifVisible}
        onClose={() => setNotifVisible(false)}
        userId={userId}
      />

      {showOverlay && (
        <>
          <Pressable style={styles.overlayBackdrop} onPress={() => setShowOverlay(false)} />

          <View style={styles.overlay}>
            <Pressable
              style={styles.overlayButton}
              onPress={() => {
                setShowOverlay(false);
                router.push('/tabs/add-income');
              }}
            >
              <Text style={styles.overlayButtonText}>Add Income</Text>
            </Pressable>
            <Pressable
              style={styles.overlayButton}
              onPress={() => {
                setShowOverlay(false);
                router.push('/tabs/add-expense');
              }}
            >
              <Text style={styles.overlayButtonText}>Add Expense</Text>
            </Pressable>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C6844F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  overlayButton: {
    backgroundColor: '#C6844F',
    borderRadius: 20,
    marginBottom: 5,
    width: 275,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
  },
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 15,
  },
});