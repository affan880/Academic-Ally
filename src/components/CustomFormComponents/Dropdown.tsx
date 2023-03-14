import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useFormikContext} from 'formik';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  leftIcon: any;
  placeholder: string;
  handlePasswordVisibility?: any;
  name: string;
  securuty?: boolean;
  data?: any;
  width?: any;
  other?: any;
  handleOptions?: any;
};

const {width, height} = Dimensions.get('window');
export const CustomDropdown = ({
  leftIcon,
  placeholder,
  name,
  data,
  width,
  handleOptions,
  ...other
}: Props) => {
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext<any>();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (values[name] || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: '#FFFFFF'}]}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
      );
    }
    return null;
  };
  return (
    <View style={styles.container}>
      <View>
        {renderLabel()}
        <Dropdown
          style={[
            styles.input,
            {width: width},
            touched[name] && errors[name]
              ? {
                  borderColor: '#FF2E00',
                  borderWidth: 2,
                }
              : null,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search={
            name === 'branch' || name === 'Year' || name === 'sem' ? false : true
          }
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : ''}
          searchPlaceholder="Search..."
          value={value}
          showsVerticalScrollIndicator={false}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setIsFocus(false);
            setFieldTouched(name);
          }}
          dropdownPosition="auto"
          {...other}
          containerStyle={{
            width: width,
            borderRadius: 10,
            elevation: 3,
            marginTop: -35,
          }}
          itemContainerStyle={{
            // height: 50,
            // justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
          }}
          itemTextStyle={{
            fontSize:  height * 0.0235,
            color: '#000000',
          }}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            setFieldValue(name, item.value);
            handleOptions(item);
          }}
          renderLeftIcon={() =>
            name === 'university' ? (
              <FontAwesome
                style={styles.icon}
                color={isFocus ? 'blue' : 'black'}
                name={'university'}
                size={height * 0.025}
              />
            ) : (
              <AntDesign
                style={styles.icon}
                color={isFocus ? 'blue' : 'black'}
                name={leftIcon}
                size={height * 0.025}
              />
            )
          }
        />
      </View>
      {touched[name] && errors[name] ? (
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: height * 0.015,
            fontFamily: 'Poppins-Regular',
            alignSelf: 'center',
            fontWeight: 'bold',
          }}>
          {errors[name] + ' '}
        </Text>
      ) : null}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    height: height * 0.07,
    borderRadius: 10,
    elevation: 3,
    paddingLeft: 20,
    marginTop: 10,
    alignItems: 'center',
    color: '#000000',
  },
  textInput: {
    width: 250,
    fontSize:  height * 0.0235,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  container: {
    marginTop: 10,
    color: '#000000',
  },
  dropdown: {
    width: 300,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 0,
    color: '#000000',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#6360FF',
    left: 22,
    top: 4,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: height * 0.018,
    borderRadius: 5,
    color: '#FFFFFF',
  },
  placeholderStyle: {
    fontSize: width * 0.035,
    color: '#808080',
  },
  selectedTextStyle: {
    fontSize:  height * 0.0235,
    color: '#000000',
    flexWrap: 'nowrap',
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginRight: 12,
  },
  inputSearchStyle: {
    height: 40,
    fontSize:  height * 0.0235,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
});
