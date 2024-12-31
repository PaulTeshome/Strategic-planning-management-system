import * as yup from 'yup';

// const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
// const phoneRegExp = /^\d{9}$/;

// const phoneRegExp = /^[97]\d{8}$/;
// const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const loginSchema = yup.object().shape({
	email: yup.string().required('Email is required'),
	password: yup.string().required('Password is required'),
});

export const vpPlanSchema = yup.object().shape({
	year: yup.number().min(1, 'year cannot be negative number').required('Year is required'),
	department: yup.string().required('Department is required'),
});

export const vpReportSchema = yup.object().shape({
	year: yup.number().min(1, 'year cannot be negative number').required('Year is required'),
	department: yup.string().required('Department is required'),
});

export const generateReportSchema = yup.object().shape({
	year: yup.number().min(1, 'year cannot be negative number').required('Year is required'),
	department: yup.string().required('Department is required'),
	plan_document: yup
		.mixed()
		.nullable() // Allow null
		.required('Plan document is required') // Make optional
		.test(
			'fileFormat',
			'Unsupported File Format. Please select a PDF or Word document',
			(value) =>
				!value ||
				[
					'application/pdf',
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				].includes(value?.type)
		)
		.test('fileSize', 'File too large. Maximum size is 4MB', (value) => !value || value.size <= 4000000), // Max size 2MB
});

export const scheduleSchema = yup.object().shape({
	schedule_date: yup.date().typeError('Please specify a valid date!').required('required!'),
});
