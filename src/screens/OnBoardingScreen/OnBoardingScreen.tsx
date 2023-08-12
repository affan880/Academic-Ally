import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { ALLYBOT, FIRSTONBOARDINGSCREEN, SECONDONBOARDINGSCREEN, SEEKHUB, THIRDONBOARDINGSCREEN } from '../../assets';
import NavigationService from '../../services/NavigationService';

const Bar_Height: any = StatusBar.currentHeight;
const Full_Screen_Height = Dimensions.get('screen').height;
const Full_Screen_Width = Dimensions.get('screen').width;

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}

const OnBoardingScreen: FC<IProps> = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const onboardingRef = useRef<Onboarding>(null);
  const [statusBarColor, setStatusBarColor] = useState('#6360FF');
  const colors = ['#6360FF', '#827FFF', '#FF8181']

  const reRun = () => {
    bounceAnim.setValue(0);
  
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  
    const firstBounce = Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 10,
      tension: 100,
      useNativeDriver: true,
    });
  
    const secondBounce = Animated.spring(bounceAnim, {
      toValue: 0, // Corrected to return to the initial position
      friction: 10,
      tension: 150,
      useNativeDriver: true,
    });
  
    Animated.sequence([firstBounce, secondBounce]).start();
  };
  

  useEffect(() => {
    reRun()
  }, [fadeAnim, slideAnim]);


  const handleCompleteOnboarding = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    NavigationService.navigate(NavigationService.screens.Auth);
  };

  return (
    <Animated.View
    style={[styles.statusBar, styles.container, { opacity: fadeAnim }]}
    >
      <StatusBar animated={true} translucent={true} backgroundColor={'#827FFF'} />
      <Onboarding
        onSkip={handleCompleteOnboarding}
        onDone={handleCompleteOnboarding}
        nextLabel={<Text style={styles.buttonText}>Next</Text>}
        transitionAnimationDuration={300}
        // controlStatusBar={true}
        skipLabel={<Text style={styles.buttonText}>Skip</Text>}
        imageContainerStyles={styles.imageContainer}
        ref={onboardingRef}
        pageIndexCallback={(index)=>{
          reRun();
          setStatusBarColor(colors[index])
        }}
        pages={[
          {
            backgroundColor: '#827FFF',
            image: (
              <Animated.Image
                source={THIRDONBOARDINGSCREEN}
                style={[
                  styles.image,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -25],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ),
            titleStyles: styles.title,
            subTitleStyles: styles.subTitle,
            title: 'Academic Hub!',
            subtitle:
              'Stay ahead of the curve and take control of your studies with our innovative notes app.',
          },
          {
            backgroundColor: '#827FFF',
            image: (
              <Animated.Image
                source={SECONDONBOARDINGSCREEN}
                style={[
                  styles.image,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -25],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ),
            subTitleStyles: styles.subTitle,
            titleStyles: styles.title,
            title: 'Manage Your Notes and Resources',
            subtitle:
              'Effortlessly manage all your notes, syllabus, and other resources with our intuitive notes app.',
          },
          // {
          //   backgroundColor: '#FF8181',
          //   image: (
          //     <Animated.Image
          //       source={FIRSTONBOARDINGSCREEN}
          //       style={[
          //         styles.image,
          //         {
          //           transform: [
          //             {
          //               translateY: bounceAnim.interpolate({
          //                 inputRange: [0, 1],
          //                 outputRange: [0, -25],
          //               }),
          //             },
          //           ],
          //         },
          //       ]}
          //     />
          //   ),
          //   title: 'One Place for All Your Study Needs',
          //   titleStyles: styles.title,
          //   subTitleStyles: styles.subTitle,
          //   subtitle:
          //     'Keep all your notes, syllabus, and other resources in one convenient place with our notes app.',
          // },
          {
            backgroundColor: '#827FFF',
            image: (
              <Animated.Image
                source={SEEKHUB}
                style={[
                  styles.image,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -25],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ),
            title: 'SeekHub - Your Academic Resource Hub',
            titleStyles: styles.title,
            subTitleStyles: styles.subTitle,
            subtitle:  
            "Find everything you need for your academic journey, right at your fingertips.",
          },
          {
            backgroundColor: '#827FFF',
            image: (
              <Animated.Image
                source={ALLYBOT}
                style={[
                  styles.image,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -25],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ),
            title: 'AllyBot: Your PDF Conversationalist',
            titleStyles: styles.title,
            subTitleStyles: styles.subTitle,
            subtitle:
              'Unlock AllyBot: Communicate with PDFs effortlessly using natural language. Get instant answers and seamless interactions in one intelligent chatbot.',
          },
        ]}
      />
    </Animated.View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: Full_Screen_Height,
  },
  imageContainer: {
    marginTop: 0,
    marginBottom: 0,
    height: Full_Screen_Height / 1.5 - Bar_Height - 200,
  },
  image: {
    width: Full_Screen_Width - 100,
    height: Full_Screen_Height / 1.5 - Bar_Height - 200,
    resizeMode: 'contain',
  },
  title: {
    color: '#F1F1FA',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  subTitle: {
    color: '#F1F1FA',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
});