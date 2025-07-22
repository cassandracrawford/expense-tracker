<<<<<<< Updated upstream
import { StyleSheet, Text, View } from 'react-native';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
=======
import { Pressable, ScrollView, StyleSheet, Text, View, Switch, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useFonts as useOpenSansFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { useRouter } from 'expo-router';
import supabase from '@/lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import EditProfile from '@/components/editProfileModal';

export default function SettingsScreen() {
    const router = useRouter();

    //  Fonts
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium});
>>>>>>> Stashed changes
    const [opensansLoaded] = useOpenSansFonts({OpenSans_400Regular, OpenSans_700Bold});
   
    //  To display fullname and email
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(''); 
    const [modalProfileVisible, setModalProfileVisible] = useState(false);

<<<<<<< Updated upstream
    const router = useRouter();

    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text>Settings</Text>
        </View>
=======
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user info:', error.message);
      } else if (data) {
        setFullName(data.full_name);
        setEmail(data.email);
      }
    };

    useEffect(() => {
     fetchUserDetails();
    }, []);

    // edit profile
    const handleSaveProfile = async (updatedName: string, updatedEmail: string) => {
      try {

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message);
        Alert.alert('Error', 'Unable to identify the user.');
        return;
      }

      const safeName = updatedName?.trim() ?? '';
      const safeEmail = updatedEmail?.trim()?.toLowerCase() ?? '';

      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email: safeEmail,
      });

      if (emailUpdateError) {
        console.error('Email update error:', emailUpdateError.message);
        Alert.alert('Error', 'Failed to update email.');
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: safeName,
          email: safeEmail,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError.message);
        Alert.alert('Error', 'Failed to save changes.');
        return;
      }

      Alert.alert('Success', 'Profile updated successfully!');
      setModalProfileVisible(false); // Close the modal
      fetchUserDetails();
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'Something went wrong while saving your profile.');
      }
    };
    
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


    // Logout
    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    router.replace('/auth/login'); 
    };

    //  Load Fonts
    if (!montserratLoaded || !opensansLoaded) {
        return null;
    }

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
                    <Text style={[styles.containerTitle, { paddingTop: 15, lineHeight:20}]}>
                      {fullName}
                    </Text>
                    <Text style={styles.cardSubText}>
                      {email}
                    </Text>
                  </View>
                  <Pressable
                   style={{ 
                    flexDirection: 'row',
                    justifyContent: 'flex-end', 
                    gap: 5,
                    }}
                    onPress={() => setModalProfileVisible(true)}>
                      <Text style={[styles.cardText, { textDecorationLine: 'underline'}]}>Edit Profile</Text>

                      <MaterialCommunityIcons 
                        name="pencil-outline"
                        size={16} 
                        color={'#5C4630'}
                      />
                  </Pressable>
                  <EditProfile 
                    visible={modalProfileVisible} 
                    onClose={() => setModalProfileVisible(false)}
                    currentFullName={fullName}
                    currentEmail={email}
                    onSave={handleSaveProfile}
                  />
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
>>>>>>> Stashed changes
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
