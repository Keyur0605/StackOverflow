import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name:  Yup.string().min(2, 'Too Short!').max(15, 'Too Long!').required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  
});

export const login = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  
});