import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";

type LoginButtonProps = {
    buttonLabel: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    onPress: () => void;
}
export default function LoginButton({
    buttonLabel, 
    style, 
    textStyle,
    onPress,
    } : LoginButtonProps) {
  
    return (
        <Pressable style={({ pressed }) => [
            styles.button,
            style,
            pressed && {
                transform: [{ scale: 0.97 }],
                opacity: 0.9,
                },
            ]}
            onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{buttonLabel}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 310,
        height: 40,
        marginBottom: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        textAlignVertical: 'center',
        lineHeight: 20,
    }
})