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
import AntDesign from 'react-native-vector-icons/AntDesign';
import createStyles from './styles';
import {Avatar, VStack, AlertDialog, Button, Toast, Modal, Box, Stack} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import { setUserProfile } from '../../redux/reducers/usersData';
import auth from '@react-native-firebase/auth';

type MyStackParamList = {
  UpdateInformation: {itemId: number};
};
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const Profile = () => {
  const styles = createStyles();
  const user = auth().currentUser;
  const [isOpen, setIsOpen] = React.useState(false);
  const [password, setPassword] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const userImage = useSelector((state: any) => {
    return state.usersData.userProfile;
  });
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  type MyScreenNavigationProp = StackNavigationProp<
    MyStackParamList,
    'UpdateInformation'
  >;
  const avatarsList = [
    {
      id: 1,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar.png?alt=media&token=e2eb7fb7-88f0-4a9f-9033-e1d9f42027ec',
    },
    {
      id: 2,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar2.png?alt=media&token=61ae44eb-bc9c-4140-b908-6b904f45be65',
    },
    {
      id: 3,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar3.png?alt=media&token=5a38de8a-5892-422a-823c-69493a19d210',
    },
    {
      id: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar4.png?alt=media&token=55d92538-5eaa-4dc9-8c81-3d16a64e6a94',
    },
    {
      id: 5,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar5.png?alt=media&token=bf17dc7c-55c8-4d0e-9451-42a1e5292c9a',
    },
    {
      id: 6,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar6.png?alt=media&token=197ddb9f-5a78-42fd-b956-6ca44d4085a0',
    },
    {
      id: 7,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar7.png?alt=media&token=936a3b53-3c0c-489a-8cb3-a599847e9cf6',
    },
    {
      id: 8,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar8.png?alt=media&token=2fc7c467-aaa0-41ac-aad1-f8c8d1b300c7',
    },
  ];
  const dispatch = useDispatch();
  const navigation = useNavigation<MyScreenNavigationProp>();
  const userFirestoreData = useSelector((state: any) => {
    return state.usersData;
  });

  const updateUserImage = (img:string) => {
    auth()
      .currentUser?.updateProfile({
        photoURL: img,
      })
      .then(() => {
        dispatch(setUserProfile(img));
        Toast.show({
          title: 'Avatar updated successfully',
          duration: 3000,
          backgroundColor: '#00b300',
        });
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
         <VStack alignItems="center" space={2} marginTop={10} width={"100%"} justifyContent={"center"} >
            <Avatar source={{
              uri: userImage||user?.photoURL
            }}size={'2xl'} alignSelf={'center'}/>
            <AntDesign
              name="pluscircle"
              size={20}
              color="#FF8181"
              onPress={() => setModalVisible(true)}
              style={{
                position: 'relative',
                bottom: 32,
                left: 40,
                zIndex: 999,
                backgroundColor: '#ffffff',
                borderRadius: 50,
              }}
            />
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Choose Avatar</Modal.Header>
                <Modal.Body>
                  <Stack style={styles.gridContainer} >
                   {
                      avatarsList.map((item) => {
                        return (
                          <TouchableOpacity  key={item.id} onPress={() => {
                            updateUserImage(item.image);
                            setModalVisible(false);
                          }}>
                           <Avatar source={
                              {
                                uri: item.image
                              }
                           } size={'xl'} style={styles.gridItem} alignSelf={'center'} />
                          </TouchableOpacity>
                        )
                      })
                   }
                   </Stack>
                </Modal.Body>
              </Modal.Content>
            </Modal>
         </VStack>
        <Text style={styles.name}>{userFirestoreData.usersData.name}</Text>
        <Text style={styles.email}>{userFirestoreData.usersData.email}</Text>
      </View>
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
            <Text style={{color: '#91919F', fontSize: 16}} >
             By proceeding with this action, you will be permanently deleting all account data. This action cannot be undone. Once the data is deleted, it cannot be recovered.
            </Text>
            <Text style={{color: '#161719', fontSize: 16, marginTop: 10}} >
               Are you sure you want to proceed?
            </Text>
            {/* <TextInput
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
            /> */}
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
                    ?.currentUser?.delete()
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
