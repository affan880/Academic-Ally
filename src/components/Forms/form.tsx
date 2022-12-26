import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'

type Props = {
  children: any,
  initialValues: any,
  onSubmit: (values: any) => any,
  validationSchema: any,
  innerRef?: any,
}

const Form = ({ children, initialValues, onSubmit, validationSchema, innerRef }: Props) => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} innerRef={innerRef} >
      {() => (
        <>
          {children}
        </>
      )}
    </Formik>
  )
}

export default Form

const styles = StyleSheet.create({})