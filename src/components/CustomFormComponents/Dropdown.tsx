import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

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

const { width, height } = Dimensions.get('window');
export const CustomDropdown = ({
  leftIcon,
  placeholder,
  name,
  data,
  width,
  handleOptions,
  ...other
}: Props) => {

  const theme = useSelector((state: any) => { return state.theme });
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<any>();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (values[name] || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: '#FFFFFF' }]}>
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
            { width: width, backgroundColor: theme.colors.quaternary },
            touched[name] && errors[name]
              ? {
                borderColor: '#FF2E00',
                borderWidth: 2,
              }
              : null,
          ]}
          placeholderStyle={[styles.placeholderStyle, { color: theme.colors.primaryText }]}
          selectedTextStyle={[styles.selectedTextStyle, {
            color: theme.colors.primaryText,
          }]}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search={
            name === 'branch' || name === 'Year' || name === 'year' || name === 'sem' || name === 'Syllabus' || name === 'course' || name === 'university' || name === 'category' ? false : true
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
            value !== null || value !== '' || value !== undefined ? handleOptions(value) : null;
          }}
          onConfirmSelectItem={item => {
            value !== null || value !== '' || value !== undefined ? handleOptions(value) : null;
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
            backgroundColor: theme.colors.quaternary,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
            borderRadius: 10
          }}
          itemTextStyle={{
            fontSize: height * 0.0205,
            color: theme.colors.terinaryText,
          }}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            setFieldValue(name, item.value);
            handleOptions(item);
          }} renderRightIcon={() => (
            <Feather
              style={styles.icon}
              color={isFocus ? '#6360FF' : '#706f6f'}
              name={'chevron-down'}
              size={height * 0.028}
            />
          )}
          renderLeftIcon={() =>
            name === 'university' ? (
              <FontAwesome
                style={styles.icon}
                color={isFocus ? '#6360FF' : theme.colors.primaryText}
                name={'university'}
                size={height * 0.025}
              />
            ) : (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#6360FF' : theme.colors.primaryText}
                name={leftIcon}
                size={height * 0.025}
              />
            )
          }
        />
      </View>
      {touched[name] && errors[name] && values[name] === "" ? (
        <Text
          style={{
            color: '#000000',
            fontSize: height * 0.015,
            fontFamily: 'Poppins-Regular',
            alignSelf: 'flex-start',
            marginLeft: 0,
            fontWeight: 'bold',
          }}>
          *{errors[name] + ' '}
        </Text>
      ) : null}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#000',
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
    fontSize: height * 0.0235,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  container: {
    marginTop: 1,
    color: '#000000',
  },
  dropdown: {
    width: 300,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 0,
    fontSize: height * 0.0135,
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
  },
  selectedTextStyle: {
    fontSize: height * 0.018,
    flexWrap: 'nowrap',
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginRight: 12,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: height * 0.0235,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
});
