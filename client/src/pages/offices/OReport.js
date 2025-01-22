import { Button, Grid2, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SelectComponent from '../../components/form/SelectComponent';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { tokens } from '../../theme';
import { vpPlanSchema } from '../../utils/yupSchemas';
import { useFormik } from 'formik';
import CreateReportTable from '../../components/tables/CreateReportTable';
import ReportModal from '../../components/modals/ReportModal';

function OReport() {
	const theme = useTheme();
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

	const [rows, setRows] = useState(() => {
		const storedPlan = localStorage.getItem(`plan ${date.getFullYear()}`);
		return storedPlan ? JSON.parse(storedPlan) : [];
	});

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
			reportData: rows,
		},
		validationSchema: vpPlanSchema,
		onSubmit: handleSearch,
	});

	const [openReport, setOpenReport] = useState(false);

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
		>
			<Typography variant="h5" component="p" fontWeight="bold">
				Insert Reports
			</Typography>
			<Grid2
				container
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				gap={1}
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				noValidate
			>
				<Grid2 size={{ xs: 3 }}>
					<TextField
						name="year"
						label="Year"
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
						value={values.department}
						onChange={handleChange}
						onBlur={handleBlur}
						options={[
							{ value: 'all', label: 'All' },
							{ value: 'av', label: getDepartmentByRole('av') },
							{ value: 'vpo', label: getDepartmentByRole('vpo') },
							{ value: 'rv', label: getDepartmentByRole('rv') },
							{ value: 'ado', label: getDepartmentByRole('ado') },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button type="submit" fullWidth variant="contained" size="large">
						Search Plan
					</Button>
				</Grid2>

				<Grid2 size={{ xs: 12 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Report for {values.year}
					</Typography>
				</Grid2>
			</Grid2>
			<Button onClick={() => setOpenReport(true)} variant="text">
				Open Report
			</Button>
			<ReportModal
				rows={rows}
				title={`Report for ${values.year}`}
				open={openReport}
				onCancel={() => setOpenReport(false)}
				setRows={setRows}
				year={values.year}
			/>
		</Stack>
	);
}

export default OReport;
