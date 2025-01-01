import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { mockPlan } from '../../components/data/mockData';
import { Add, CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import MyContext from '../../utils/MyContext';
import * as yup from 'yup';
import CreatePlanTable from '../../components/tables/CreatePlanTable';

const createPlanSchema = yup.object().shape({
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

function OPlan() {
	const theme = useTheme();
	const { user } = useContext(MyContext);
	const colors = tokens(theme.palette.mode);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [rows, setRows] = useState([]);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};
	const handleApprove = () => {
		console.log('🚀 ~ handleApprove ~ first:', planFormik.values);
	};
	const handleSearch = () => {};

	const date = new Date();

	const planFormik = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: user.r_data,
			plan_document: null,
		},
		validationSchema: createPlanSchema,
		onSubmit: handleSearch,
	});

	// const tableFormik = useFormik({
	// 	initialValues: {
	// 		year: date.getFullYear(),
	// 		department: user.r_data,
	// 		plan_document: null,
	// 	},
	// 	validationSchema: createPlanSchema,
	// });

	// const tableSchema = tableFields.reduce((acc, field) => {
	// 	if (field.type === 'checkbox') {
	// 		if (field.required) {
	// 			acc[field.name] = yup.array().min(1, `Please select a ${field.label}!`);
	// 		} else {
	// 			acc[field.name] = yup.array();
	// 		}
	// 	} else {
	// 		if (field.required) {
	// 			acc[field.name] = yup.string().required(`${field.label} is required`);
	// 		} else {
	// 			acc[field.name] = yup.string();
	// 		}
	// 	}
	// 	return acc;
	// }, {});

	const addGoal = () => {
		const goalNumber = rows.length + 1;
		const newGoal = {
			number: goalNumber,
			main_goal: `goal ${goalNumber}`,
			weight: '',
			main_functions: [],
		};

		setRows((prev) => [...prev, newGoal]);
	};

	return (
		<Stack
			direction="column"
			display="flex"
			justifyContent="space-between"
			bgcolor={colors.grey[100]}
			width="100%"
			minHeight={150}
			borderRadius="5px"
			boxShadow={5}
			p={2}
			px={5}
			gap={2}
			component="form"
			onSubmit={planFormik.handleSubmit}
			autoComplete="off"
			noValidate
		>
			<Typography variant="h5" component="p" fontWeight="bold">
				Create {getDepartmentByRole(user.r_data)} Plans
			</Typography>
			<Grid2 container display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
				<Grid2 size={{ xs: 12 }} display="flex" alignItems="flex-end" pl="85%" maxHeight="fit-content">
					<Button
						onClick={() => {
							setConfirmOpen(true);
						}}
						fullWidth
						variant="contained"
						size="large"
					>
						Submit Plan
					</Button>
					<ConfirmationModal
						open={confirmOpen}
						onCancel={closeConfirm}
						onConfirm={() => {
							planFormik.submitForm();
							setConfirmOpen(false);
						}}
						title="Submit Plan"
						message="Are you sure you want to submit this plan?"
					/>
				</Grid2>
				<Grid2 size={{ xs: 3 }}>
					<TextField
						name="year"
						label="Year"
						disabled
						type="number"
						fullWidth
						value={planFormik.values.year}
						onChange={planFormik.handleChange}
						onBlur={planFormik.handleBlur}
						slotProps={{
							htmlInput: {
								min: 1,
							},
						}}
						error={planFormik.touched.year && !!planFormik.errors.year}
						helperText={planFormik.touched.year && planFormik.errors.year}
					/>
				</Grid2>
				<Grid2 size={{ xs: 4 }}>
					<SelectComponent
						required={true}
						planFormiktouched={planFormik.touched.department}
						error={planFormik.errors.department}
						label="Department*"
						name="department"
						disabled={true}
						value={planFormik.values.department}
						onChange={planFormik.handleChange}
						onBlur={planFormik.handleBlur}
						options={[
							{ value: 'av', label: 'Academic Vice Office' },
							{ value: 'vpo', label: 'Vice President Office' },
							{ value: 'rv', label: 'Research Vice Office' },
							{ value: 'ado', label: 'Administration Vice Office' },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 4 }}>
					<TextField
						fullWidth
						type="file"
						label="Plan Document"
						name="plan_document"
						onBlur={planFormik.handleBlur}
						onChange={(event) => {
							planFormik.setFieldValue('plan_document', event.currentTarget.files[0]);
						}}
						// value={undefined}
						error={planFormik.touched.plan_document && Boolean(planFormik.errors.plan_document)}
						helperText={planFormik.touched.plan_document && planFormik.errors.plan_document}
						slotProps={{
							inputLabel: { shrink: true },
							inputProps: {
								accept: '.pdf, .doc, .docx', // Accept only PDF and Word files
								variant: 'outlined',
							},
						}}
					/>
				</Grid2>

				<Grid2 size={{ xs: 12 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Plan for {planFormik.values.year}
					</Typography>
				</Grid2>
				<Grid2 size={{ xs: 12 }} display="flex" pl="85%" alignItems="flex-end" maxHeight="fit-content">
					<Button
						onClick={() => {
							addGoal();
						}}
						fullWidth
						variant="contained"
						startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
						sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
						size="small"
					>
						Add Goal
					</Button>
				</Grid2>
			</Grid2>

			<CreatePlanTable
				formikValue={planFormik}
				columns={[
					{ name: 'Number', colSpan: 1 },
					{ name: 'Strategic Goals , Main Activities, Detail functions and KPIs', colSpan: 1 },
					{ name: 'Weights', colSpan: 1 },
					{ name: 'Measurements', colSpan: 1 },
					{ name: `Previous year(${planFormik.values.year - 1}) value`, colSpan: 1 },
					{ name: `This year(${planFormik.values.year}) Goal`, colSpan: 1 },
					{ name: 'Quarter 1', colSpan: 1 },
					{ name: 'Quarter 2', colSpan: 1 },
					{ name: 'Quarter 3', colSpan: 1 },
					{ name: 'Quarter 4', colSpan: 1 },
					{ name: 'Department', colSpan: 1 },
				]}
				rows={rows}
				setRows={setRows}
			/>
		</Stack>
	);
}

export default OPlan;
