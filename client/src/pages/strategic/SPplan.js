import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { Formik, useFormik } from 'formik';
import SelectComponent from '../../components/form/SelectComponent';
import { feedbackValidationSchema, vpPlanSchema } from '../../utils/yupSchemas';
import ViewPlanTable from '../../components/tables/ViewPlanTable';
import { CheckCircle } from '@mui/icons-material';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { useParams } from 'react-router-dom';
import usePlanApi from '../../api/plan';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MyContext from '../../utils/MyContext';
import useFeedbackApi from '../../api/feedback';

function SPplan() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [rows, setRows] = useState([]);
	const date = new Date();

	const { plan_id } = useParams();
	const { getPlan, getBy, updatePlan } = usePlanApi();

	const [selectedPlan, setSelectedPlan] = useState({ _id: plan_id, year: 2025 });

	const getPlanQuery = useQuery({
		queryKey: ['plan', plan_id, 'submitted'],
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
			const planInfo = getPlanQuery.data?.data?.data[0];
			console.log('🚀 ~ useMemo ~ planInfo:', planInfo);
			setSelectedPlan({ ...planInfo });
			setRows([...patientList]);
		}
	}, [getPlanQuery.status, getPlanQuery.data]);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};

	const handleSearch = (values) => {
		// const { year, department } = values;
		getByYearnDeptQ.refetch();
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched, setTouched, validateForm } = useFormik({
		initialValues: {
			year: selectedPlan?.year || date.getFullYear(),
			department: '',
		},
		validationSchema: vpPlanSchema,
		onSubmit: handleSearch,
		enableReinitialize: true,
	});

	const getByYearnDeptQ = useQuery({
		queryKey: ['plan', values.year, values.department, 'submitted'],
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
			// console.log('🚀 ~ useMemo ~ getPlan', getByYearnDeptQ.data);
			const planData = getByYearnDeptQ.data?.data?.data[0]?.planData || [];
			const planInfo = getByYearnDeptQ.data?.data?.data[0];
			console.log('🚀 ~ useMemo ~ planInfo:', planInfo);
			setSelectedPlan({ ...planInfo });
			setRows([...planData]);
		}
	}, [getByYearnDeptQ.status, getByYearnDeptQ.data]);

	const { user } = useContext(MyContext);
	const { addFeedback } = useFeedbackApi();
	const queryClient = useQueryClient();

	const addFeedMut = useMutation({
		mutationFn: addFeedback,
		mutationKey: ['addFeedback'],
		onSuccess: (response) => {
			// console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success(response.status);
			queryClient.invalidateQueries({ queryKey: ['plan'] });
		},
		onError: (error) => {
			// console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handleFeedbackSubmit = (values) => {
		// console.log('🚀 ~ handleFeedbackSubmit ~ values:', values);
		const data = {
			plan_id: selectedPlan._id,
			user_id: user.user_id,
			message: values.message,
		};
		console.log('🚀 ~ handleFeedbackSubmit ~ data:', data);

		addFeedMut.mutate(data);
	};

	const updatePlanMut = useMutation({
		mutationFn: updatePlan,
		mutationKey: ['updatePlan'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success('Update ' + response.status);
			queryClient.invalidateQueries({ queryKey: ['plans'] });
			// setUpdate(false);
			getPlanQuery.refetch();
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handleApprove = (values) => {
		console.log('🚀 ~ handleApprove ~ first:', values);
		const data = { plan_id: selectedPlan._id, status: 'requested' };
		if (selectedPlan._id === undefined || selectedPlan._id === null) {
			toast.error('Please select a plan for approval!');
			return;
		}
		updatePlanMut.mutate(data);
		// console.log('🚀 ~ handleApprove ~ data:', data);
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
						Search Plan
					</Button>
				</Grid2>
				<Grid2 size={{ xs: 12 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Plan for {selectedPlan.year}
					</Typography>
				</Grid2>
				<Grid2 size={{ xs: 12 }} display="flex" pl="80%" maxHeight="fit-content">
					<Button
						fullWidth
						onClick={async () => {
							// const errors = await validateForm(); // Validate form fields
							// setTouched({
							// 	year: true,
							// 	department: true,
							// });

							// if (Object.keys(errors).length === 0) {
							handleApprove(values);
							setConfirmOpen(false);
							// } else {
							// 	toast.error('Please fix validation errors before proceeding.');
							// }
						}}
						variant="contained"
						startIcon={<CheckCircle sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
						sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
						size="medium"
					>
						Request Plan Approval
					</Button>
					<ConfirmationModal
						open={confirmOpen}
						onCancel={closeConfirm}
						onConfirm={() => {
							handleApprove(values);
							setConfirmOpen(false);
						}}
						title="Approve Plan"
						message="Are you sure you want to approve this plan?"
					/>
				</Grid2>
			</Grid2>
			{rows.length > 0 && (
				<Grid2 container display="flex" justifyContent="flex-start" alignItems="center" width="100%" gap={1}>
					<Formik
						onSubmit={handleFeedbackSubmit}
						initialValues={{
							message: '',
						}}
						validationSchema={feedbackValidationSchema}
					>
						{({ values, errors, touched, handleBlur, handleChange, submitForm, setFieldValue }) => (
							<>
								<Grid2 size={{ xs: 9 }}>
									<TextField
										fullWidth
										variant="outlined"
										multiline
										rows={4}
										type="text"
										label="message"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.message}
										name="message"
										error={touched.message && Boolean(errors.message)}
										helperText={touched.message && errors.message}
									/>
								</Grid2>
								<Grid2 size={{ xs: 12 }}>
									<Button
										onClick={() => {
											submitForm();
										}}
										variant="outlined"
									>
										Send Feedback
									</Button>
								</Grid2>
							</>
						)}
					</Formik>
				</Grid2>
			)}

			<ViewPlanTable
				columns={[
					{ name: 'Number', colSpan: 1 },
					{ name: 'Strategic Goals , Main Activities, Detail functions and KPIs', colSpan: 1 },
					{ name: 'Weights', colSpan: 1 },
					{ name: 'Measurements', colSpan: 1 },
					{ name: `Previous year(${selectedPlan.year - 1}) value`, colSpan: 1 },
					{ name: `This year(${selectedPlan.year}) Goal`, colSpan: 1 },
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

export default SPplan;
