import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo} from 'react';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  children?: React.ReactNode;
  rightIconFalse: boolean;
  title: string;
  handleScroll: (event: any) => void;
}

const navigationLayout = ({children, rightIconFalse, title, handleScroll}: Props) => {
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(), []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }} >
        <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 30,
          height: 30,
        }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        {title && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        )}
        {!rightIconFalse && (
          <MaterialCommunityIcons
            name="backup-restore"
            size={30}
            color="#ffffff"
          />
        )}
        {rightIconFalse && (
          // empty view
          <View style={{width: 30}} />
        )}
      </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <ScrollView
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default navigationLayout;

const styles = StyleSheet.create({});
