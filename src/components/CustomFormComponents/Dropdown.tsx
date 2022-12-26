import React, { useState } from 'react'
import { StyleSheet, Text, TextProps, TextInput, View, TouchableOpacity } from 'react-native'
import { useFormikContext } from 'formik'
import { Dropdown } from "react-native-element-dropdown"
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
    leftIcon: any,
    placeholder: string,
    handlePasswordVisibility?: any,
    name: string,
    securuty?: boolean, 
    data?: any,
    width?: any,
}
export const CustomTextInput = ({ leftIcon, placeholder, name, data, width }: Props) => {
    const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>();
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false)
    const renderLabel = () => {
        if (values[name] || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>{name}</Text>
            )
        }
        return null;
    }
    return (
        <View style={styles.container}>
        <View >
            {renderLabel()}
            <Dropdown
                    style={[styles.input,{width: width}, touched[name] && errors[name] ? {
                        borderColor: '#FF2E00',
                        borderWidth: 3,
                    } : null]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? placeholder : ''}
                searchPlaceholder="Search..."
                value={value}
                showsVerticalScrollIndicator={false}
                onFocus={() => setIsFocus(true)}
                    onBlur={() => {
                        setIsFocus(false)
                        setFieldTouched(name);
                    }}
                dropdownPosition = 'auto'
                    containerStyle={{
                        width: width,
                        height: 400,
                        borderRadius: 15,
                        elevation: 8,
                    }}
                    itemContainerStyle={{
                        height: 50,
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e5e5e5',
                        borderRadius: 15,
                    }}
                    itemTextStyle={{
                        fontSize: 16,
                }}
                    onChange={(item) => {
                        setValue(item.value);
                        setIsFocus(false);
                        setFieldValue(name, item.label);
                    }
                    }
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name={leftIcon}
                        size={20}
                    />
                )}
            />
            </View>
        </View>
    )
}

export default CustomTextInput

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        height: 60,
        borderRadius: 20,
        elevation: 8,
        paddingLeft: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    textInput: {
        height: 60,
        width: 250,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular'
    },
    container: {
        marginTop: 10,
    },
    dropdown: {
        height: 50,
        width: 300,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 15,
    },
    label: {
        position: 'absolute',
        backgroundColor: '#A094E3',
        left: 22,
        top: 4,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        borderRadius: 5
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 25,
        height: 25,
        marginRight:15
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})