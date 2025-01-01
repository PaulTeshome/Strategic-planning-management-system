import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import ViewPlanTable from '../../components/tables/ViewPlanTable';
import { mockPlan } from '../../components/data/mockData';
import { Add, CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import MyContext from '../../utils/MyContext';
import * as yup from 'yup';

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

	const closeConfirm = () => {
		setConfirmOpen(false);
	};
	const handleApprove = () => {
		console.log('🚀 ~ handleApprove ~ first:', values);
	};
	const handleSearch = () => {};

	const date = new Date();

	const { values, errors, handleSubmit, handleBlur, handleChange, setFieldValue, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: user.r_data,
			plan_document: null,
		},
		validationSchema: createPlanSchema,
		onSubmit: handleSearch,
	});

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
			onSubmit={handleSubmit}
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
							handleApprove();
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
						value={values.year}
						onChange={handleChange}
						onBlur={handleBlur}
						slotProps={{
							htmlInput: {
								min: 1,
							},
						}}
						error={touched.year && !!errors.year}
						helperText={touched.year && errors.year}
					/>
				</Grid2>
				<Grid2 size={{ xs: 4 }}>
					<SelectComponent
						required={true}
						touched={touched.department}
						error={errors.department}
						label="Department*"
						name="department"
						disabled={true}
						value={values.department}
						onChange={handleChange}
						onBlur={handleBlur}
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
						onBlur={handleBlur}
						onChange={(event) => {
							setFieldValue('plan_document', event.currentTarget.files[0]);
						}}
						// value={undefined}
						error={touched.plan_document && Boolean(errors.plan_document)}
						helperText={touched.plan_document && errors.plan_document}
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
						Plan for {values.year}
					</Typography>
				</Grid2>
				<Grid2 size={{ xs: 12 }} display="flex" pl="85%" alignItems="flex-end" maxHeight="fit-content">
					<Button
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

			<ViewPlanTable
				columns={[
					{ name: 'Number', colSpan: 1 },
					{ name: 'Strategic Goals , Main Activities, Detail functions and KPIs', colSpan: 1 },
					{ name: 'Weights', colSpan: 1 },
					{ name: 'Measurements', colSpan: 1 },
					{ name: `Previous year(${values.year - 1}) value`, colSpan: 1 },
					{ name: `This year(${values.year}) Goal`, colSpan: 1 },
					{ name: 'Quarter 1', colSpan: 1 },
					{ name: 'Quarter 2', colSpan: 1 },
					{ name: 'Quarter 3', colSpan: 1 },
					{ name: 'Quarter 4', colSpan: 1 },
					{ name: 'Department', colSpan: 1 },
				]}
				rows={mockPlan}
			/>
		</Stack>
	);
}

export default OPlan;
