import React,{useState} from 'react' 
import { StyleSheet, Dimensions, TextInput, View, TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { useFormikContext } from 'formik'
type Props = {
  leftIcon : any,
  placeholder : string,
  handlePasswordVisibility?: any,
  name: string
  securuty?: boolean
}

const Width = Dimensions.get('screen').width;

export const CustomTextInput = ({ leftIcon, placeholder, handlePasswordVisibility, name }: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true)
  const {values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>(); 
  return (
    <View style={styles.container}>
      <View style={[styles.input, touched[name] && errors[name] ? {
        borderColor: '#FF2E00',
        borderWidth: 3,
} : null]} >
        <Feather name={leftIcon} size={18} color={touched[name] && errors[name] ? '#FF2E00' : '#000000' }  style={{ paddingRight: 15, alignSelf: "center" }} />
      <TextInput placeholder={placeholder} value={values[name]} onChangeText={(text) => {
        setFieldValue(name, text)
        }}
          onBlur={() => setFieldTouched(name)}
          style={styles.textInput}
          maxLength={50}
          secureTextEntry={name === 'password' || name === 'confirmPassword'? passwordVisibility : false}
      />
        {touched[name] && errors[name] && name !== 'password' && name !== 'confirmPassword'  ? <Feather name="alert-circle" size={18} color="#FF2E00" /> : null}
        {name === 'password' || name === 'confirmPassword' ? <TouchableOpacity onPress={() => setPasswordVisibility(!passwordVisibility)} style={{ paddingRight: 15, alignSelf: "center" }} >
          <Feather name={passwordVisibility ? "eye" : "eye-off"} size={18} color={touched[name] && errors[name] ? "#FF2E00" :"#000000" } />
        </TouchableOpacity> : null}
      </View>
    </View>
  )
}

export default CustomTextInput

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    width: Width - 80,
    height: 60,
    borderRadius: 20,
    elevation: 8,
    paddingLeft: 20,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  container: {
    marginTop: 10,
  },
  textInput: {
    height: 60,
    width: '80%',
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins-Regular'
  },
})