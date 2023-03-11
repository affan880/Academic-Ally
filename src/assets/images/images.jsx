import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';

export function ReportIconBlack (props){
   return (
     <Image source={require('../images/ReportIconBlack.png')} style={{width: 25, height: 25}}/>
   )
}

export function ShareIconImg (){
    return(
        <Image source={require('../images/ShareIcon.png')} style={{width: 25, height: 25}}/>
    )
}
export function ReportIconWhite (){
    return(
        <Image source={require('../images/ReportIconWhite.png')} style={{width: 20, height: 20}}/>
    )
}