import * as yup from 'yup'

export const loginDataSchema = yup.object({
    username: yup.string().required().min(2),
    password: yup.string().required(),
});

export type LoginDataType = yup.InferType<typeof loginDataSchema>;

export const registerDataSchema = yup.object({
    username: yup.string().required().min(2),
    password: yup.string().required(),
    confirmPassword: yup.string().required().oneOf([yup.ref('password'), ''], 'Passwords must match'),
})

export type RegisterDataType = yup.InferType<typeof registerDataSchema>;
