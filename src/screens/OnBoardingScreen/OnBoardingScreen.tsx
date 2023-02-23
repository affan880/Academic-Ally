import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import Onboarding from 'react-native-onboarding-swiper';
import {
  FIRSTONBOARDINGSCREEN,
  SECONDONBOARDINGSCREEN,
  THIRDONBOARDINGSCREEN,
} from '../../assets';
const Bar_Height: any = StatusBar.currentHeight;
const Full_Screen_Height = Dimensions.get('screen').height;
const Full_Screen_Width = Dimensions.get('screen').width;
interface IProps {
  navigation: NavigationProp<ParamListBase>;
}
const OnBoardingScreen: FC<IProps> = ({navigation}) => {
  return (
    <View style={[styles.statusBar, styles.container]}>
      <StatusBar
        animated={true}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <Onboarding
        onSkip={() => navigation.navigate('LoginScreen')}
        onDone={() => navigation.navigate('LoginScreen')}
        nextLabel={
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              width: 50,
            }}>
            Next
          </Text>
        }
        skipLabel={
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              width: 50,
            }}>
            Skip
          </Text>
        }
        // DoneButtonComponent={() => (
        //   <Text
        //     style={{
        //       fontSize: 16,
        //       fontWeight: 'bold',
        //       width: 50,
        //     }}>
        //     Done
        //   </Text>
        // )}
        imageContainerStyles={{
          marginTop: 0,
          marginBottom: 0,
          height: Full_Screen_Height / 1.5 - Bar_Height - 200,
        }}
        pages={[
          {
            backgroundColor: '#6360FF',
            image: (
              <Image
                source={THIRDONBOARDINGSCREEN}
                style={{
                  width: Full_Screen_Width - 100,
                  height: Full_Screen_Height / 1.5 - Bar_Height - 200,
                  resizeMode: 'contain',
                }}
              />
            ),
            titleStyles: {
              color: '#fff',
              fontSize: 26,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
              paddingHorizontal: 10,
            },
            subTitleStyles: {
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
              textAlign: 'center',
            },
            title: 'Academic Hub!',
            subtitle:
              'Stay ahead of the curve and take control of your studies with our innovative notes app. View, share, and explore all your notes, syllabus, and other important resources in one convenient place.',
          },
          {
            backgroundColor: '#827FFF',
            image: (
              <Image
                source={SECONDONBOARDINGSCREEN}
                style={{
                  width: Full_Screen_Width - 100,
                  height: Full_Screen_Height / 1.5 - Bar_Height - 200,
                  resizeMode: 'contain',
                }}
              />
            ),
            subTitleStyles: {
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 0,
              paddingHorizontal: 15,
            },
            title: 'Effortlessly Manage Your Notes and Resources',
            titleStyles: {
              color: '#fff',
              fontSize: 26,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
              paddingHorizontal: 10,
            },
            subtitle:
              'Say goodbye to messy notebooks and cluttered folders. Effortlessly manage all your notes, syllabus, and other resources with our intuitive notes app.',
          },
          {
            backgroundColor: '#FF8181',
            image: (
              <Image
                source={FIRSTONBOARDINGSCREEN}
                style={{
                  width: Full_Screen_Width - 100,
                  height: Full_Screen_Height / 1.5 - Bar_Height - 200,
                  resizeMode: 'contain',
                }}
              />
            ),
            title: 'One Place for All Your Study Needs',
            titleStyles: {
              color: '#fff',
              fontSize: 26,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
            },
            subTitleStyles: {
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 0,
              paddingHorizontal: 10,
            },
            subtitle:
              'Say goodbye to juggling multiple apps for your studies. Keep all your notes, syllabus, and other resources in one convenient place with our notes app',
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
});
