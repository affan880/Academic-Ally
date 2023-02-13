import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenLayout from '../../interfaces/screenLayout';
import createStyles from './styles';
import {Avatar, VStack, AlertDialog, Button, Toast} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
const User = require('../../assets/images/user.jpg');

type MyStackParamList = {
  UpdateInformation: {itemId: number};
};
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const Profile = () => {
  const styles = createStyles();

  const [isOpen, setIsOpen] = React.useState(false);

  const [password, setPassword] = useState<string>('');

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  type MyScreenNavigationProp = StackNavigationProp<
    MyStackParamList,
    'UpdateInformation'
  >;
  const navigation = useNavigation<MyScreenNavigationProp>();

  const userFirestoreData = useSelector((state: any) => {
    return state.usersData;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color="#ffffff"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.headerText}>Account</Text>
        </View>
        <Avatar source={User} size={'2xl'} alignSelf={'center'} mt={10} />
        <Text style={styles.name}>{userFirestoreData.usersData.Name}</Text>
        <Text style={styles.email}>{userFirestoreData.usersData.Email}</Text>
      </TouchableOpacity>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.menuContainer}>
              <VStack>
                <View>
                  <Text style={styles.settingsTitleText}>Account Settings</Text>
                </View>
                <TouchableOpacity
                  style={styles.settingsContainer}
                  onPress={() => {
                    navigation.navigate('UpdateInformation', {
                      itemId: 86,
                    });
                  }}>
                  <Text style={styles.settingsText}>Update Information</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#91919F"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.settingsContainer}
                  onPress={() => {
                    auth().signOut();
                  }}>
                  <Text style={styles.settingsText}>Log Out</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#91919F"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.settingsContainer}
                  onPress={() => setIsOpen(!isOpen)}>
                  <Text style={styles.settingsText}>Delete Account</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#91919F"
                  />
                </TouchableOpacity>
              </VStack>
            </View>
          </ScrollView>
        </View>
      </View>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Account</AlertDialog.Header>
          <AlertDialog.Body>
            This will remove all data the accounts data. This action cannot be
            reversed. Deleted data can not be recovered.
            <TextInput
              onChangeText={text => {
                setPassword(text);
              }}
              placeholder="Enter your password to confirm"
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                borderBottomColor: '#91919F',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center',
                color: '#91919F',
                width: width * 0.6,
              }}
            />
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Cancel
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => {
                  auth()
                    ?.currentUser?.delete(auth()?.currentUser?.email, password)
                    .then(() => {
                      Toast.show({
                        title: 'Account Deleted',
                        backgroundColor: '#F44336',
                        color: '#ffffff',
                      });
                    })
                    .catch(error => {
                      auth().signOut();
                      Toast.show({
                        title: 'Error',
                        description: error.message,
                        backgroundColor: '#F44336',
                        color: '#ffffff',
                      });
                    });
                }}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
