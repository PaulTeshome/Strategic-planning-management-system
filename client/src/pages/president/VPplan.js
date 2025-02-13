import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { vpPlanSchema } from '../../utils/yupSchemas';
import ViewPlanTable from '../../components/tables/ViewPlanTable';
import { CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import usePlanApi from '../../api/plan';
import toast from 'react-hot-toast';

function VPplan() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [rows, setRows] = useState([]);
	const date = new Date();

	const { plan_id } = useParams();
	const { getPlan, getBy } = usePlanApi();

	const getPlanQuery = useQuery({
		queryKey: ['plan', plan_id, 'requested'],
		enabled: plan_id !== undefined && plan_id !== null,
		queryFn: getPlan,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getPlanQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPlanQuery.error:', getPlanQuery.error);
			toast.error(
				getPlanQuery.error?.response?.data?.message || getPlanQuery.error.message || 'Error getting plans'
			);
		}
	}, [getPlanQuery.status, getPlanQuery.error]);

	useMemo(() => {
		if (getPlanQuery.status === 'success') {
			console.log('🚀 ~ useMemo ~ getPlan', getPlanQuery.data);
			const patientList = getPlanQuery.data?.data?.data[0]?.planData || [];
			setRows([...patientList]);
		}
	}, [getPlanQuery.status, getPlanQuery.data]);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};
	const handleApprove = () => {
		console.log('🚀 ~ handleApprove ~ first:', values);
	};

	const handleSearch = (values) => {
		// const { year, department } = values;
		getByYearnDeptQ.refetch();
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
		},
		validationSchema: vpPlanSchema,
		onSubmit: handleSearch,
	});

	const getByYearnDeptQ = useQuery({
		queryKey: ['plan', values.year, values.department, 'requested'],
		enabled: false,
		queryFn: getBy,
		staleTime: 1000 * 60 * 5,
		retry: false,
	});

	useEffect(() => {
		if (getByYearnDeptQ.status === 'error') {
			// console.log('🚀 ~ Patients ~ getByYearnDeptQ.error:', getByYearnDeptQ.error);
			toast.error(
				getByYearnDeptQ.error?.response?.data?.message || getByYearnDeptQ.error.message || 'Error getting plans'
			);
		}
	}, [getByYearnDeptQ.status, getByYearnDeptQ.error]);

	useMemo(() => {
		if (getByYearnDeptQ.status === 'success') {
			console.log('🚀 ~ useMemo ~ getPlan', getByYearnDeptQ.data);
			const planData = getByYearnDeptQ.data?.data?.data[0]?.planData || [];
			setRows([...planData]);
		}
	}, [getByYearnDeptQ.status, getByYearnDeptQ.data]);

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
							{ value: 'av', label: getDepartmentByRole('av') },
							{ value: 'vpo', label: getDepartmentByRole('vpo') },
							{ value: 'rv', label: getDepartmentByRole('rv') },
							{ value: 'ado', label: getDepartmentByRole('ado') },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button
						type="submit"
						disabled={getByYearnDeptQ.isLoading}
						fullWidth
						variant="contained"
						size="large"
					>
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
						disabled={rows.length === 0}
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
				rows={rows}
			/>
		</Stack>
	);
}

export default VPplan;
