import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

// Request permission to send notifications
// messaging().requestPermission()
//     .then(() => {
//         console.log('Notification permission granted');
//     })
//     .catch(error => {
//         console.log('Failed to get notification permission', error);
//     });

// Handle background messages
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
