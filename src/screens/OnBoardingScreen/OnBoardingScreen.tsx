import React, { FC } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Dimensions } from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import Onboarding from 'react-native-onboarding-swiper';  
import { FIRSTONBOARDINGSCREEN, SECONDONBOARDINGSCREEN, THIRDONBOARDINGSCREEN } from "../../assets";
const Bar_Height = StatusBar.currentHeight;
const Full_Screen_Height = Dimensions.get('screen').height;
interface IProps {
    navigation: NavigationProp<ParamListBase>
}
const OnBoardingScreen:FC <IProps> = ({ navigation}) => {
    return (
        <View style={[styles.statusBar, styles.container]}>
            <StatusBar
                animated={true}
                translucent={true}
                backgroundColor={'transparent'}
            />
            <Onboarding
                onSkip={() => navigation.navigate("LoginScreen")}
                onDone={() => navigation.navigate("LoginScreen")}
                nextLabel={<Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    width: 50,
                }} >Next</Text>}
                skipLabel={<Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    width: 50,
                }} >Skip</Text>}
                pages={[
                    {
                        backgroundColor: '#03202B',
                        image: <Image source={THIRDONBOARDINGSCREEN}
                            style={
                                {
                                    width: 300,
                                    height: 300,
                                    resizeMode: 'contain'
                                }
                            } />,
                        titleStyles: {
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginTop: 20
                        },
                        title: 'Onboarding',
                        subtitle: 'loreum ipsum dolor sit amet, consectetur adipiscing elit.',
                    },
                    {
                        backgroundColor: '#A094E3',
                        image: <Image source={SECONDONBOARDINGSCREEN} style={
                            {
                                width: 300,
                                height: 300,
                                resizeMode: 'contain'
                            }
                        } />,
                        title: 'The Title',
                        titleStyles: {
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginTop: 20
                        },
                        subtitle: 'This is the subtitle that sumplements the title.',
                    },
                    {
                        backgroundColor: '#1A6B6B',
                        image: <Image source={FIRSTONBOARDINGSCREEN} style={
                            {
                                width: 300,
                                height: 300,
                                resizeMode: 'contain'
                            }
                        } />,
                        title: 'Triangle',
                        titleStyles: {
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginTop: 20
                        },
                        subtitle: "Beautiful, isn't it?",
                    },
                ]}
            />
        </View>
    );
}

export default OnBoardingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: Full_Screen_Height,
    }
});

