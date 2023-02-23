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

const navigationLayout = ({children, rightIconFalse, title, handleScroll}) => {
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(), []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
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
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}>
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default navigationLayout;

const styles = StyleSheet.create({});
