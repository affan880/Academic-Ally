import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { FC } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { FIRSTONBOARDINGSCREEN, SECONDONBOARDINGSCREEN, THIRDONBOARDINGSCREEN } from '../../assets';
import NavigationService from '../../services/NavigationService';

const Bar_Height: any = StatusBar.currentHeight;
const Full_Screen_Height = Dimensions.get('screen').height;
const Full_Screen_Width = Dimensions.get('screen').width;

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}

const OnBoardingScreen: FC<IProps> = ({ navigation }) => {
  const handleCompleteOnboarding = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    NavigationService.navigate(NavigationService.screens.Login);
  };

  return (
    <View style={[styles.statusBar, styles.container]}>
      <StatusBar animated={true} translucent={true} backgroundColor={'#6360FF'} />
      <Onboarding
        onSkip={handleCompleteOnboarding}
        onDone={handleCompleteOnboarding}
        nextLabel={<Text style={styles.buttonText}>Next</Text>}
        skipLabel={<Text style={styles.buttonText}>Skip</Text>}
        imageContainerStyles={styles.imageContainer}
        pages={[
          {
            backgroundColor: '#6360FF',
            image: (
              <Image source={THIRDONBOARDINGSCREEN} style={styles.image} />
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
              <Image source={SECONDONBOARDINGSCREEN} style={styles.image} />
            ),
            subTitleStyles: styles.subTitle,
            title: 'Manage Your Notes and Resources',
            titleStyles: styles.title,
            subtitle:
              'Effortlessly manage all your notes, syllabus, and other resources with our intuitive notes app.',
          },
          {
            backgroundColor: '#FF8181',
            image: (
              <Image source={FIRSTONBOARDINGSCREEN} style={styles.image} />
            ),
            title: 'One Place for All Your Study Needs',
            titleStyles: styles.title,
            subTitleStyles: styles.subTitle,
            subtitle:
              'Keep all your notes, syllabus, and other resources in one convenient place with our notes app.',
          },
        ]}
      />
    </View>
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
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  subTitle: {
    color: '#fff',
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