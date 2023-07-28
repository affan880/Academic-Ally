import { Icon, IconButton } from 'native-base'
import React, { useMemo } from 'react';
import { Button, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import createStyles from './styles';

const width = (number) => {
    let fullWidth = Dimensions.get("window").width;
    if (number >= 100) return fullWidth;
    else if (number <= 0) return 0;
    else return fullWidth * (number / 100);
  };

export default function Header() {
    
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.white}]}>
      <Image
        source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/logo%2FAcademicAllyLogo.png?alt=media&token=0c6b43ea-6d06-49b1-acdf-5516bed88f28'
        }}
        style={{width: width(25)}}
        resizeMode={'contain'}
      />
    </View>
  );
}
export const ChatHeader = ({
  name = '? ? ?',
  onPress,
}) => {
    
  const theme = useSelector((state) => { return state.theme; });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  return (
    <View style={[styles.chatHeader, {backgroundColor: theme.colors.primary}]}>
        <IconButton
            borderRadius={'full'}
            _hover={{
                bg: '#D3D3D3',
            }}
            _pressed={{
                bg: '#D3D3D3',
            }}
            onPress={onPress}
            variant="ghost"
            icon={<Icon as={Ionicons} name="chevron-back-outline" size={'lg'} color={theme.colors.white} />}
            p={0}
        />
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/logo%2FAlly Bot™.png?alt=media&token=d3b0a0ad-8dc7-4428-84de-4b952f0998ad'
          }}
          style={styles.avatarImg2} 
        />
      <Text style={styles.nameText}>{name}</Text>
      {/* <View style={styles.status} /> */}
    </View>
  );
};