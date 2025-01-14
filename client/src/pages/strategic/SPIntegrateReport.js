import { useTheme } from '@emotion/react';
import { Button, Grid2, TextField } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import { generateReportSchema } from '../../utils/yupSchemas';
import SelectComponent from '../../components/form/SelectComponent';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

function SPIntegrateReport() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const date = new Date();

	const [confirmOpen, setConfirmOpen] = useState(false);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};

	const handleGenerate = (values) => {
		console.log('🚀 ~ handleReportIntegration ~ values:', values);
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched, setFieldValue, submitForm } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
			plan_document: null,
		},
		validationSchema: generateReportSchema,
		onSubmit: handleGenerate,
	});
	return (
		<Grid2 container display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" gap={1}>
			<Grid2
				size={{ xs: 12, md: 9 }}
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
				bgcolor={colors.grey[100]}
				minHeight={400}
				borderRadius="5px"
				boxShadow={5}
				p={6}
				gap={2}
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				noValidate
			>
				<TextField
					name="year"
					label="Year"
					type="number"
					fullWidth
					// disabled
					value={values.year}
					onChange={handleChange}
					onBlur={handleBlur}
					slotProps={{
						htmlInput: {
							min: date.getFullYear(),
						},
					}}
					error={touched.year && !!errors.year}
					helperText={touched.year && errors.year}
				/>

				<SelectComponent
					required={true}
					touched={touched.department}
					error={errors.department}
					label="Department*"
					name="department"
					value={values.department}
					onChange={handleChange}
					onBlur={handleBlur}
					options={[
						{ value: 'all', label: 'All' },
						{ value: 'academics', label: 'Academics Office' },
						{ value: 'president', label: 'President Office' },
						{ value: 'research', label: 'Research Office' },
						{ value: 'administration', label: 'Administration Office' },
					]}
				/>
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
				<Button
					onClick={() => {
						setConfirmOpen(true);
					}}
					fullWidth
					variant="contained"
					size="large"
				>
					Integrate Report
				</Button>
			</Grid2>
			<ConfirmationModal
				open={confirmOpen}
				onCancel={closeConfirm}
				onConfirm={() => {
					submitForm();
					setConfirmOpen(false);
				}}
				title="Integrate Report"
				message="Are you sure you want to send this report to vice president?"
			/>
		</Grid2>
	);
}

export default SPIntegrateReport;
