import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    name : yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(12, 'Name must be less than 12 characters'),
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password must be less than 20 characters'),
    confirmPassword: yup.string().required().min(6).oneOf([yup.ref('password')], 'Passwords must match'),
    course: yup.string().required(),
    sem: yup.string().required(),
    branch: yup.string().required(),
    year : yup.string().required(),
})
export const LoginvalidationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password must be less than 20 characters'),
})

export const UploadvalidationSchema = yup.object().shape({
    facultyName: yup.string(),
    // college: yup.string(),
    // notesId: yup.string().required('Id is required'),
    // sem: yup.string().required(),
    // branch: yup.string().required(),
    // subjectName: yup.string().required(),
    // course: yup.string().required()
})

export const NotesSearchValidationSchema = yup.object().shape({
    sem: yup.string(),
    branch: yup.string(),
    course: yup.string(),
    notes:yup.string()
})

export const updatevalidationSchema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(12, 'Name must be less than 12 characters'),
    course: yup.string(),
    sem: yup.string(),
    branch: yup.string(),
    year: yup.string(),
})