import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    username : yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(12, 'Name must be less than 12 characters'),
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password must be less than 20 characters'),
    confirmPassword: yup.string().required().min(6).oneOf([yup.ref('password')], 'Passwords must match'),
    Course: yup.string().required(),
    Sem: yup.string().required(),
    Branch: yup.string().required(),
    Year : yup.string().required(),
})
export const LoginvalidationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password must be less than 20 characters'),
})