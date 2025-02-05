import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { vpReportSchema } from '../../utils/yupSchemas';
import ViewReportTable from '../../components/tables/ViewReportTable';
import { mockReport } from '../../components/data/mockData';
import { CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useReportApi from '../../api/report';
import toast from 'react-hot-toast';

function VPReport() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [rows, setRows] = useState([]);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};

	const handleSearch = () => {
		getPlanQuery.refetch();
	};
	const date = new Date();

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
		},
		validationSchema: vpReportSchema,
		onSubmit: handleSearch,
	});

	const { getRBy, updateReport } = useReportApi();

	const [reportData, setReportData] = useState({});

	const getPlanQuery = useQuery({
		queryKey: ['report', values.year, values.department, 'requested'],
		queryFn: getRBy,
		staleTime: 1000 * 60 * 5,
		// enabled: false,
		// retry: false,
	});

	useEffect(() => {
		if (getPlanQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPlanQuery.error:', getPlanQuery.error);
			toast.error(
				getPlanQuery.error?.response?.data?.message || getPlanQuery.error.message || 'Error getting plan',
				{
					id: 'getPlan',
				}
			);
		}
	}, [getPlanQuery.status, getPlanQuery.error]);

	useMemo(() => {
		if (getPlanQuery.status === 'success') {
			const planData = getPlanQuery.data?.data?.data[0]?.planData || [];
			console.log('🚀 ~ useMemo ~ planData: page lvl vp', planData);
			const repData = getPlanQuery.data?.data?.data[0];
			setReportData({ ...repData });

			setRows([...planData]);
		}
	}, [getPlanQuery.status, getPlanQuery.data]);

	const queryClient = useQueryClient();

	const updatePlanMut = useMutation({
		mutationFn: updateReport,
		mutationKey: ['updateReport'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success('Update ' + response.status);
			queryClient.invalidateQueries({ queryKey: ['report'] });

			getPlanQuery.refetch();
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handleApprove = () => {
		console.log('🚀 ~ handlePlanUpdate ~ reportData;:', reportData);

		const data = {
			status: 'approved',
			report_id: reportData._id,
		};

		updatePlanMut.mutate(data);
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
		>
			<Typography variant="h5" component="p" fontWeight="bold">
				View Report
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
							// { value: 'all', label: 'All' },
							{ value: 'av', label: getDepartmentByRole('av') },
							{ value: 'vpo', label: getDepartmentByRole('vpo') },
							{ value: 'rv', label: getDepartmentByRole('rv') },
							{ value: 'ado', label: getDepartmentByRole('ado') },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button type="submit" fullWidth variant="contained" size="large">
						Search Report
					</Button>
				</Grid2>
				<Grid2 size={{ xs: 9 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Report for {values.year}
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
						Approve Report
					</Button>
					<ConfirmationModal
						open={confirmOpen}
						onCancel={closeConfirm}
						onConfirm={() => {
							handleApprove();
							setConfirmOpen(false);
						}}
						title="Approve Report"
						message="Are you sure you want to approve this report?"
					/>
				</Grid2>
			</Grid2>

			<ViewReportTable
				topColumns={[
					{ name: '', colSpan: 10 },
					{ name: 'Quarter 1', colSpan: 2 },
					{ name: 'Quarter 2', colSpan: 2 },
					{ name: 'Quarter 3', colSpan: 2 },
					{ name: 'Quarter 4', colSpan: 2 },
				]}
				columns={[
					{ name: 'Number', colSpan: 1 },
					{ name: 'Titles', colSpan: 5 },
					{ name: 'Weights', colSpan: 1 },
					{ name: 'Measurements', colSpan: 1 },
					{ name: `Previous year(${values.year - 1}) value`, colSpan: 1 },
					{ name: `This year(${values.year}) Goal`, colSpan: 1 },
					{
						name: 'Plan',
						colSpan: 1,
					},
					{
						name: 'Progress',
						colSpan: 1,
					},

					{
						name: 'Plan',
						colSpan: 1,
					},
					{
						name: 'Progress',
						colSpan: 1,
					},

					{
						name: 'Plan',
						colSpan: 1,
					},
					{
						name: 'Progress',
						colSpan: 1,
					},

					{
						name: 'Plan',
						colSpan: 1,
					},
					{
						name: 'Progress',
						colSpan: 1,
					},
					{
						name: 'Performance',
						colSpan: 0.5,
					},
					{ name: 'Department', colSpan: 1 },
				]}
				rows={rows}
			/>
		</Stack>
	);
}

export default VPReport;
