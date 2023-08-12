import { ShareIcon, ShareIconImg } from '../../assets/images/icons';
import { ReportIconBlack, ReportIconWhite } from '../../assets/images/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const createThemeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: 'light',
        light: {
            primary: "#6360FF",
            secondary: "#F1F1FA",
            tertiary: "#FF8181",
            quaternary: "#FCFCFF",
            text: "#1A1B36",
            primaryText: "#161719",
            textSecondary: "#91919F",
            terinaryText: "#706f6f",
            greenSuccess: "#7DC579",
            redError: "#FF0000",
            yellowWarning: "#FFD700",
            SearchCategory: "#6360FF",
            white: "#FCFCFF",
            black: "#161719",
            categoryBtn: '#FCFCFF',
            disabledCategoryBtn: '#D3D3D3',
            mainTheme: '#6360FF',
            popOver: '#FCFCFF',
            shareIcon: ShareIconImg, 
            reportIcon: ReportIconBlack,
            actionSheet: '#FCFCFF'
        },
        dark: {
            primary: "#292B2D",
            secondary: "#161719",
            tertiary: "#FF8181",
            quaternary: "#212325",
            text: "#FCFCFF",
            primaryText: "#FCFCFF",
            terinaryText: "#706f6f",
            textSecondary: "#F3F3F8",
            textTertiary: "#B3B3B8",
            greenSuccess: "#7DC579",
            redError: "#FF0000",
            yellowWarning: "#FFC960",
            SearchCategory: "#F1F1FA",
            white: "#FCFCFF",
            black: "#161719",
            categoryBtn: '#6360FF',
            disabledCategoryBtn: '#D3D3D3',
            mainTheme: '#6360FF',
            popOver: '#292B2D',
            shareIcon: ShareIcon,
            reportIcon: ReportIconWhite,
            actionSheet: '#292B2D'
        },
        colors: {
            primary: "#6360FF",
            secondary: "#F1F1FA",
            tertiary: "#FF8181",
            quaternary: "#FCFCFF",
            text: "#1A1B36",
            primaryText: "#161719",
            terinaryText: "#706f6f",
            textSecondary: "#91919F",
            textTertiary: "#B3B3B8",
            greenSuccess: "#7DC579",
            redError: "#FF0000",
            yellowWarning: "#FFC960",
            SearchCategory: "#6360FF",
            white: "#FCFCFF",
            black: "#161719",
            categoryBtn: '#FCFCFF',
            disabledCategoryBtn: '#D3D3D3',
            mainTheme: '#6360FF',
            popOver: '#FCFCFF',
            shareIcon: ShareIcon,
            reportIcon: ReportIconBlack,
            logo: '../../../assets/images/white-logo.png',
            actionSheet: '#FCFCFF'
        },
        sizes: {
            title: height * 0.020,
            subtitle: height * 0.018,
            text: height * 0.02,
            textSmall: height * 0.015,
            textMidTiny: height * 0.013,
            textTiny: height * 0.01,
            button: height * 0.05,
            buttonSmall: height * 0.03,
            buttonTiny: height * 0.02,
            buttonIcon: height * 0.03,
            buttonIconSmall: height * 0.02,
            buttonIconTiny: height * 0.01,
            icon: height * 0.05,
            iconMedium: height * 0.035,
            iconSmall: height * 0.025,
            iconMini: height * 0.020,
            label: height * 0.03,
            lottieIconHeight: height * 0.4,
            height,
            width,
        },
        isPotrait: true,
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setLightTheme: (state) => {
            state.theme = 'light';
            state.colors = state.light;
        },
        setDarkTheme: (state) => {
            state.theme = 'dark';
            state.colors = state.dark;
        },
        getCurrentTheme: (state) => {
            AsyncStorage.getItem('theme')
                .then((value) => {
                    if (value !== null) {
                        state.theme = value;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            AsyncStorage.getItem('colors')
                .then((value) => {
                    if (value !== null) {
                        state.colors = JSON.parse(value);
                    }
                }
                )
                .catch((error) => {
                    console.log(error);
                }
                );
        },
        setIsPotrait: (state, action) => {
            state.isPotrait = action.payload;
            if (action.payload === false) {
                state.sizes.height = width;
                state.sizes.width = height;
            }
            else {
                state.sizes.height = height;
                state.sizes.width = width;
            }
        },
    }
});

export const {
    setTheme,
    setLightTheme,
    setDarkTheme,
    getCurrentTheme,
    setIsPotrait,
} = createThemeSlice.actions;

export default createThemeSlice.reducer;
