import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {CustomBtn} from '../CustomFormComponents/CustomBtn'
import { useFormikContext } from "formik";

type Props = {
  title: string;
  color: string;
}

const formButton = ({title,color}: Props) => {
  const { handleSubmit } = useFormikContext();

  return <CustomBtn title={title} onPress={handleSubmit} color={color} />;
}

export default formButton

const styles = StyleSheet.create({})