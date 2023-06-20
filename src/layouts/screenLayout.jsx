import React, {useEffect} from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useSelector} from 'react-redux';

const ScreenLayout = ({name, children}) => {
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;
  const theme = useSelector(state => state.theme);
  const statusBarHeight = StatusBar.currentHeight;
  useEffect(() => {
    if (name === 'PdfViewer') {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);
  return (
    <View
      //enable potrait and landscape
      // style={{ flex: 1, width: '100%', height: height }}
      style={{
        flex: 1,
        width: '100%',
        height: height,
        backgroundColor: theme.colors.primary,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={theme.colors.primary}
        barStyle={'light-content'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#F1F1FA',
          height: height,
          width: width,
        }}>
        {children}
      </View>
    </View>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({});
