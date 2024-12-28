import * as yup from "yup";

// const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
// const phoneRegExp = /^\d{9}$/;
const phoneRegExp = /^[97]\d{8}$/;
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const loginSchema = yup.object().shape({
    staff_id: yup.string().required("Staff id  is required"),
    password: yup.string().required("Password is required"),
});

export const scheduleSchema = yup.object().shape({
    schedule_date: yup
        .date()
        .typeError("Please specify a valid date!")
        .required("required!"),
});
