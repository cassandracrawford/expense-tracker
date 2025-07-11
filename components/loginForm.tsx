import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useFonts as useMontserratFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

type LoginFormProps = {
    inputLabel: string;
    placeholderText: string;
    iconName: keyof typeof FontAwesome5.glyphMap;
    isPassword: boolean;
}

export default function LoginForm({inputLabel, iconName, placeholderText , isPassword} : LoginFormProps){
    const [montserratLoaded] = useMontserratFonts({Montserrat_400Regular, Montserrat_700Bold});
    const [isHidden, setIsHidden] = useState(true);
    
    if (!montserratLoaded) {
        return null;
    }

    return(
        <View>
            <Text style={styles.inputLabel}>{inputLabel}</Text>
            <View style={styles.inputWrapper}>
                <FontAwesome5 name={iconName} size={20} color="#3A2A21" solid />
                <TextInput style={styles.input} placeholder={placeholderText} secureTextEntry={isPassword && isHidden}/>
                {isPassword && (
                    <Pressable onPress={() => setIsHidden(!isHidden)}>
                        <MaterialIcons
                            name={isHidden ? "visibility-off" : "visibility"}
                            size={20}
                            color="#3A2A21"
                            style={{marginLeft: "auto"}}
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputLabel: {
        color: '#3A2A21',
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold'
    },
    inputWrapper: {
        minHeight: 30,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#5C4630',
    },
    input: {
        width: 240,
        height: 30,
        fontFamily: 'Montserrat_400Regular',
        marginLeft: 10,
        fontSize: 14,
        textAlignVertical: 'center',
        paddingVertical: 0,
        includeFontPadding: false,
    }
})