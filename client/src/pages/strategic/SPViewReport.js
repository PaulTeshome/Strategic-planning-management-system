import { useTheme } from '@emotion/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import DataGridWrapper from '../../components/global/DataGridWrapper';
import CustomToolbar from '../../components/global/CustomToolbar';
import { Link } from 'react-router-dom';

import { Grid2, TextField } from '@mui/material';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { vpPlanSchema } from '../../utils/yupSchemas';
import { CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';

function SPViewReport() {
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

	const [rows, setRows] = useState([
		{
			report_id: '1',
			report_date: '12-12-2024',
			department: 'Academics',
			year: '2017',
			quarter: '1st',
			submitted_by: 'Abebe Bekele',
		},
		{
			report_id: '2',
			report_date: '12-12-2024',
			department: 'Academics',
			year: '2017',
			quarter: '1st',
			submitted_by: 'Abebe Bekele',
		},
		{
			report_id: '3',
			report_date: '12-12-2024',
			department: 'Academics',
			year: '2017',
			quarter: '1st',
			submitted_by: 'Abebe Bekele',
		},
		{
			report_id: '4',
			report_date: '12-12-2024',
			department: 'Academics',
			year: '2017',
			quarter: '1st',
			submitted_by: 'Abebe Bekele',
		},
		{
			report_id: '5',
			report_date: '12-12-2024',
			department: 'Academics',
			year: '2017',
			quarter: '1st',
			submitted_by: 'Abebe Bekele',
		},
	]);

	const columns = [
		{
			field: 'report_id',
			headerName: 'Id',
		},
		{
			field: 'report_date',
			headerName: 'Report Date',
			flex: 1,
		},
		{
			field: 'department',
			headerName: 'Department',
			flex: 1,
			valueFormatter: (params) => {
				const deptName = getDepartmentByRole(params);
				return deptName;
			},
		},
		{
			field: 'year',
			headerName: 'Year',
			flex: 1,
		},
		{
			field: 'quarter',
			headerName: 'Quarter',
			flex: 1,
		},
		{
			field: 'submitted_by',
			headerName: 'Submitted By',
			flex: 1,
		},
		{
			field: 'actions',
			headerName: 'Actions',
			disableExport: true,
			flex: 1,
			renderCell: (params) => (
				<Stack direction="row" width="100%" height="100%" display="flex" alignItems="center">
					<Button
						component={Link}
						variant="outlined"
						size="small"
						to={`/strategic/report/${params.row.report_id}`}
					>
						View
					</Button>
				</Stack>
			),
		},
	];

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%" gap={2}>
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
			</Stack>
			<Stack
				direction="column"
				display="flex"
				bgcolor={colors.grey[100]}
				width="100%"
				height="fit-content"
				minHeight={430}
				borderRadius="5px"
				boxShadow={5}
				p={1}
				px={5}
				gap={1}
			>
				<Typography variant="h5" component="p" fontWeight="bold">
					View Plans
				</Typography>
				<DataGridWrapper>
					<DataGrid
						getRowId={(row) => row.report_id}
						rows={rows}
						columns={columns}
						slots={{ toolbar: CustomToolbar }}
						initialState={{
							pagination: { pageSize: 10 },
						}}
						rowsPerPageOptions={[10, 25, 50]}
						slotProps={{
							toolbar: {
								showQuickFilter: true,
							},
						}}
					/>
				</DataGridWrapper>
			</Stack>
		</Box>
	);
}

export default SPViewReport;
