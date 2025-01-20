import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { vpPlanSchema } from '../../utils/yupSchemas';
import ViewPlanTable from '../../components/tables/ViewPlanTable';
import { mockPlan } from '../../components/data/mockData';
import { CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

function VPplan() {
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

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
		},
		validationSchema: vpPlanSchema,
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
		>
			<Typography variant="h5" component="p" fontWeight="bold">
				View Plans
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
							{ value: 'av', label: 'Academic Vice Office' },
							{ value: 'vpo', label: 'Vice President Office' },
							{ value: 'rv', label: 'Research Vice Office' },
							{ value: 'ado', label: 'Administration Vice Office' },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button type="submit" fullWidth variant="contained" size="large">
						Search Plan
					</Button>
				</Grid2>
				<Grid2 size={{ xs: 9 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Plan for {values.year}
					</Typography>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button
						fullWidth
						onClick={() => {
							setConfirmOpen(true);
						}}
						variant="contained"
						startIcon={<CheckCircle sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
						sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
						size="medium"
					>
						Approve Plan
					</Button>
					<ConfirmationModal
						open={confirmOpen}
						onCancel={closeConfirm}
						onConfirm={() => {
							handleApprove();
							setConfirmOpen(false);
						}}
						title="Approve Plan"
						message="Are you sure you want to approve this plan?"
					/>
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

export default VPplan;
