import { Pressable, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import supabase from '@/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SettingsScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium});
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});

    const [dailyEnabled, setDailyEnabled] = useState(false);
    const [weeklyEnabled, setWeeklyEnabled] = useState(false);
    const [monthlyEnabled, setMonthlyEnabled] = useState(false);

    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [currencyValue, setCurrencyValue] = useState('usd');
    const [currencyItems, setCurrencyItems] = useState([
      { label: 'US Dollar ($)', value: 'usd' },
      { label: 'Euro (€)', value: 'eur' },
      { label: 'British Pound (£)', value: 'gbp' },
    ]);

    const [languageOpen, setLanguageOpen] = useState(false);
    const [languageValue, setLanguageValue] = useState('english');
    const [languageItems, setLanguageItems] = useState([
      { label: 'English', value: 'english' },
      { label: 'French', value: 'french' },
      { label: 'Spanish', value: 'spanish' },
    ]);

    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    router.replace('/auth/login'); 
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile */}
            <View style={styles.subContainer}>
              <View style={{
                flexDirection: 'row',
                gap: 20,
              }}>
                <View style={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontFamily: 'Montserrat_500Medium',
                    fontSize: 28,
                    color: '#5C4630',
                  }}>AC</Text>
                </View>
                <View style={{ justifyContent: 'space-between', flex: 1}}>
                  <View>
                    <Text style={[styles.containerTitle, { paddingTop: 15, lineHeight:20}]}>Ameera Callahan</Text>
                    <Text style={styles.cardSubText}>ameera.callahan@example.com</Text>
                  </View>
                  <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'flex-end', 
                    gap: 5,
                  }}>
                    <Text style={[styles.cardText, { textDecorationLine: 'underline'}]}>Edit Profile</Text>
                    <MaterialCommunityIcons 
                      name="pencil-outline"
                      size={16} 
                      color={'#5C4630'}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.subContainer}>
              <Text style={styles.containerTitle}>Notifications</Text>
              <View style={[styles.card, { justifyContent: 'space-between',}]}>
                <View>
                  <Text style={styles.cardText}>Daily Summary Notifications</Text>
                  <Text style={styles.cardSubText}>Get daily spending summaries</Text>
                </View>

                <Switch
                  trackColor={{ false: '#ccc', true: '#5A4532' }} 
                  thumbColor={dailyEnabled ? '#fff' : '#fff'}
                  onValueChange={(value) => setDailyEnabled(value)}
                  value={dailyEnabled}
                />
              </View>

              <View style={[styles.card, { justifyContent: 'space-between',}]}>
                <View>
                  <Text style={styles.cardText}>Weekly Summary Notifications</Text>
                  <Text style={styles.cardSubText}>Get weekly spending summaries</Text>
                </View>

                <Switch
                  trackColor={{ false: '#ccc', true: '#5A4532' }} 
                  thumbColor={weeklyEnabled ? '#fff' : '#fff'}
                  onValueChange={(value) => setWeeklyEnabled(value)}
                  value={weeklyEnabled}
                />
              </View>
              <View style={[styles.card, { justifyContent: 'space-between',}]}>
                <View>
                  <Text style={styles.cardText}>Monthly Summary Notifications</Text>
                  <Text style={styles.cardSubText}>Get monthly spending summaries</Text>
                </View>

                <Switch
                  trackColor={{ false: '#ccc', true: '#5A4532' }} 
                  thumbColor={monthlyEnabled ? '#fff' : '#fff'}
                  onValueChange={(value) => setMonthlyEnabled(value)}
                  value={monthlyEnabled}
                />
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.subContainer}>
              <Text style={styles.containerTitle}>Preferences</Text>
              
              {/* Currency */}
              <View style={{ zIndex: 3000}}>
                  <Text style={[styles.cardText, {marginBottom: 5}]}>Default Currency</Text>
                  <DropDownPicker
                    open={currencyOpen}
                    value={currencyValue}
                    items={currencyItems}
                    setOpen={setCurrencyOpen}
                    setValue={setCurrencyValue}
                    setItems={setCurrencyItems}
                    listMode="SCROLLVIEW"
                    placeholder="Select currency"
                    style={styles.dropdown}
                    textStyle={styles.text}
                    dropDownContainerStyle={{ borderColor: '#D6C4B2'}}
                  />

              </View>

              {/* Language */}
              <View style={{ zIndex: 2000}}>
                  <Text style={styles.cardText}>Default Language</Text>
                  <DropDownPicker
                    open={languageOpen}
                    value={languageValue}
                    items={languageItems}
                    setOpen={setLanguageOpen}
                    setValue={setLanguageValue}
                    setItems={setLanguageItems}
                    listMode="SCROLLVIEW"
                    placeholder="Select language"
                    style={styles.dropdown}
                    textStyle={styles.text}
                    dropDownContainerStyle={{ borderColor: '#D6C4B2'}}
                  />
              </View>
            </View>

            {/* Security */}
            <View style={styles.subContainer}>
              <Text style={styles.containerTitle}>Security</Text>
              <View style={[styles.card, { gap: 10, paddingBottom: 10}]}>
                  <MaterialCommunityIcons
                    name="key-variant"
                    size={36}
                    color={'#5C4630'}
                  />
                  <View>
                    <Text style={styles.cardText}>Change Password</Text>
                    <Text style={styles.cardSubText}>Update your account password</Text>
                  </View>
              </View>
              <View style={[styles.card, { gap: 10, paddingBottom: 10}]}>
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={36}
                    color={'#5C4630'}
                  />
                  <View>
                    <Text style={styles.cardText}>Biometric Login</Text>
                    <Text style={styles.cardSubText}>Use Face ID or Fingerprint</Text>
                  </View>
              </View>
            </View>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
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
  card: {
    backgroundColor: '#FFFFFF',
    minHeight: 40,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    width: '100%',
    flexDirection: 'row',
  },
  cardText: {
    fontFamily: 'Montserrat_500Medium',
    color: '#5C4630',
    fontSize: 14,
  },
  cardSubText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#5C4630',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#C6844F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    width: '60%',
    marginTop: 10,
    marginBottom: 50,
    alignSelf: 'center',
  },
  logoutText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6C4B2',
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    color: '#5C4630',
    fontFamily: 'Montserrat_500Medium',
  },
});
