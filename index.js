import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

messaging().requestPermission()
    .then(() => {
        console.log('Notification permission granted');
    })
    .catch(error => {
        console.log('Failed to get notification permission', error);
    });
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

inAppMessaging().setMessagesDisplaySuppressed(true);

AppRegistry.registerComponent(appName, () => App);
