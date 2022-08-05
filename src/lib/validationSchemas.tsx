import * as Yup from 'yup';
export const AboutSchema = Yup.object().shape({
  contact: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    )
    .required('Please enter your LinkedIn profile link'),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export const OtpSchema = Yup.object().shape({
  otp: Yup.string().length(4).required('Required'),
});

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().required('Required'),
  emailConfirm: Yup.string()
    .required('Required')
    .when('email', {
      is: (email: string) => (email && email.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('email')], "Emails don't match"),
    }),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  repeatPassword: Yup.string()
    .required('Required')
    .when('password', {
      is: (password) => (password && password.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password's don't match"),
    }),
});

export const CandidateSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  email: Yup.string().email('Invalid Email').required('Email is required'),
  twitter: Yup.string().url('Invalid Twitter').required('Twitter is required'),
  github: Yup.string().url('Invalid Twitter').required('Twitter is required'),
  linkedIn: Yup.string().url('Invalid LinkedIn').required('LinkedIn is required'),
});
