import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFormikContext} from 'formik';

type Props = {
  leftIcon: any;
  placeholder: string;
  handlePasswordVisibility?: any;
  name: any;
  securuty?: boolean;
  errors?: any;
  other?: any;
};

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export const CustomTextInput = ({
  leftIcon,
  placeholder,
  handlePasswordVisibility,
  name,
  other
}: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext<any>();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.input,
          touched[name] && errors[name]
            ? {
                borderColor: '#FF2E00',
                borderWidth: 3,
              }
            : null,
        ]}>
        {name === 'college' ? (
          <FontAwesome
            size={Height * 0.025}
            color={touched[name] && errors[name] ? '#FF2E00' : '#000000'}
            style={{paddingRight: 15, alignSelf: 'center'}}
            name={'university'}
          />
        ) : (
          <Feather
            name={leftIcon}
            size={18}
            color={touched[name] && errors[name] ? '#FF2E00' : '#000000'}
            style={{paddingRight: 15, alignSelf: 'center'}}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={values[name]}
          {...other}
          onChangeText={text => {
            setFieldValue(name, text);
          }}
          onBlur={() => setFieldTouched(name)}
          placeholderTextColor={
            touched[name] && errors[name] ? '#FF2E00' : '#808080'
          }
          style={styles.textInput}
          maxLength={50}
          secureTextEntry={
            name === 'password' || name === 'confirmPassword'
              ? passwordVisibility
              : false
          }
        />
        {touched[name] &&
        errors[name] &&
        name !== 'password' &&
        name !== 'confirmPassword' ? (
          <Feather name="alert-circle" size={Height * 0.025} color="#FF2E00" />
        ) : null}
        {name === 'password' || name === 'confirmPassword' ? (
          <TouchableOpacity
            onPress={() => setPasswordVisibility(!passwordVisibility)}
            style={{paddingRight: 25, alignSelf: 'center'}}>
            <Feather
              name={passwordVisibility ? 'eye' : 'eye-off'}
              size={Height * 0.025}
              color={touched[name] && errors[name] ? '#FF2E00' : '#000000'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {touched[name] && errors[name] ? (
        <Text
          style={{
            color: '#FF2E00',
            fontSize: Height * 0.015,
            fontFamily: 'Poppins-Regular',
            paddingLeft: 20,
            fontWeight: 'bold',
          }}>
          *{errors[name]}
        </Text>
      ) : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    width: Width - 50,
    height: Height * 0.07,
    borderRadius: 10,
    elevation: 3,
    paddingLeft: 20,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    marginTop: 10,
  },
  textInput: {
    height: Height * 0.07,
    width: '78%',
    fontSize:  Height * 0.018,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    alignItems: 'center',
  },
});
