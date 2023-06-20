import React, { useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import NavigationLayout from '../../../layouts/navigationLayout';
import createStyles from './styles';

const screenWidth = Dimensions.get('screen').width;

const AboutUs = () => {
  const theme: any = useSelector((state: any) => state.theme);
  const styles: any = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  return (
    <NavigationLayout rightIconFalse={true} title="About Us" handleScroll={() => { }} >
      <View style={styles.body}>
        <Image source={theme.theme === 'light' ? require('../../../assets/images/logo_black.png') : require('../../../assets/images/white-logo.png')} style={styles.image} />
        <View style={styles.bodyContent} >
          <View style={styles.content}>
            <Text style={styles.normalText}>
              <Text style={{
                fontWeight: "700"
              }} >Welcome to Academic Ally</Text>, your go-to source for academic resources! Our app is designed to make your academic journey easier and more efficient by providing you with notes, question papers, question banks, and other helpful resources.
            </Text>
            <Text style={styles.normalText}>
              Our tiny team of engineering students recognized the need for a centralized platform that students could rely on to access academic resources. We developed Academic Ally to be a one-stop-shop for all your academic needs. Whether you are preparing for an exam or just looking to enhance your knowledge, our app has everything you need to succeed.
            </Text>
            <Text style={styles.normalText}>
              Our user-friendly interface allows you to easily access notes and resources, as well as share and upload your own notes. We believe in the power of community and encourage our users to share their knowledge with others. By working together, we can all achieve academic success.
            </Text>
            <Text style={styles.normalText}>
              At Academic Ally, we are committed to providing high-quality, up-to-date resources that are relevant to your studies. We understand the challenges of being a student, and we want to make your academic journey as smooth as possible. Our app is constantly evolving to meet the changing needs of students, and we welcome feedback from our users to help us improve.
            </Text>
          </View>
          <Text style={{
            fontSize: 16,
            color: theme.text,
            fontWeight: 'bold',
            textAlign: 'left',
            width: screenWidth,
            paddingHorizontal: 5,
            marginVertical: 10,
            marginHorizontal: 10,
          }}>
            Thank you for choosing Academic Ally as your academic ally. We are excited to be a part of your academic journey and look forward to helping you succeed!
          </Text>
        </View>
      </View>
    </NavigationLayout>
  )
}

export default AboutUs

const styles = StyleSheet.create({})