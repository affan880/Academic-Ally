import { useColorScheme, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

function useColorSchemefn() {
    const colorScheme = useColorScheme();
    return colorScheme;
}

const currentColorScheme = useColorScheme();

export const colors = {
    primary: currentColorScheme === "dark" ? "#292B2D" : "#6360FF",
    secondary: currentColorScheme === "dark" ? "#161719" : "#F1F1FA",
    tertiary: currentColorScheme === "dark" ? "#FF8181" : "#FF8181",
    text: currentColorScheme === "dark" ? "#FCFCFF" : "#1A1B36",
    textSecondary: currentColorScheme === "dark" ? "#F3F3F8" : "#91919F",
    textTertiary: currentColorScheme === "dark" ? "#B3B3B8" : "#B3B3B8",
    greenSuccess: currentColorScheme === "dark" ? "#7DC579" : "#7DC579",
    redError: currentColorScheme === "dark" ? "#FF0000" : "#FF0000",
    yellowWarning: currentColorScheme === "dark" ? "#FFD700" : "#FFD700",
};

export const light = {
    primary: "#6360FF",
    secondary: "#F1F1FA",
    tertiary: "#FF8181",
    text: "#1A1B36",
    textSecondary: "#91919F",
    textTertiary: "#B3B3B8",
    greenSuccess: "#7DC579",
    redError: "#FF0000",
    yellowWarning: "#FFD700",
}

export const dark = {
    primary: "#292B2D",
    secondary: "#161719",
    tertiary: "#FF8181",
    text: "#FCFCFF",
    textSecondary: "#F3F3F8",
    textTertiary: "#B3B3B8",
    greenSuccess: "#7DC579",
    redError: "#FF0000",
    yellowWarning: "#FFD700",
}

export const sizes = {
    title: height * 0.025,
    subtitle: height * 0.03,
    text: height * 0.02,
    textSmall: height * 0.015,
    textTiny: height * 0.01,
    button: height * 0.05,
    buttonSmall: height * 0.03,
    buttonTiny: height * 0.02,
    buttonIcon: height * 0.03,
    buttonIconSmall: height * 0.02,
    buttonIconTiny: height * 0.01,
    icon: height * 0.05,
    iconSmall: height * 0.03,
    label: height * 0.03,
}
