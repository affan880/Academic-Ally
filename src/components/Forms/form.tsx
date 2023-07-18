import { Formik } from 'formik'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  children: any,
  initialValues: any,
  onSubmit: (values: any) => any,
  validationSchema: any,
  innerRef?: any,
}

const Form = ({ children, initialValues, onSubmit, validationSchema, innerRef }: Props) => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} innerRef={innerRef} enableReinitialize={true} >
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