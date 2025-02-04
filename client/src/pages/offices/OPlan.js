import { useTheme } from '@emotion/react';
import { Button, Grid2, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { useParams } from 'react-router-dom';
import usePlanApi from '../../api/plan';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import InfoToast from '../../components/InfoToast';
import useFeedbackApi from '../../api/feedback';

const createPlanSchema = yup.object().shape({
	year: yup.number().min(1, 'year cannot be negative number').required('Year is required'),
	department: yup.string().required('Department is required'),
	plan_document: yup
		.mixed()
		.nullable() // Allow null
		// .required('Plan document is required') // Make optional
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
	const { plan_id } = useParams();
	const date = new Date();

	const [update, setUpdate] = useState(false);

	const [rows, setRows] = useState(() => {
		const storedPlan = localStorage.getItem(`plan ${date.getFullYear()}`);
		return storedPlan ? JSON.parse(storedPlan) : [];
	});
	const [feedbacks, setFeedbacks] = useState([]);

	const { getPlan, addStrategicPlan, updatePlan } = usePlanApi();
	const { getAllFeedbacks } = useFeedbackApi();

	const getFeedbackQuery = useQuery({
		queryKey: ['feedback', plan_id],
		enabled: plan_id !== undefined && plan_id !== null,
		queryFn: getAllFeedbacks,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getFeedbackQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getFeedbackQuery.error:', getFeedbackQuery.error);
			toast.custom(
				<InfoToast
					message={
						getFeedbackQuery.error?.response?.data?.message ||
						getFeedbackQuery.error.message ||
						'Error getting plan'
					}
				/>,
				{
					id: 'get feedback',
				}
			);
		}
	}, [getFeedbackQuery.status, getFeedbackQuery.error]);

	useMemo(() => {
		if (getFeedbackQuery.status === 'success') {
			// console.log('🚀 ~ useMemo ~ getFeedbackQuery', getFeedbackQuery.data);
			const planData = getFeedbackQuery.data?.data?.data || [];
			// console.log('🚀 ~ useMemo ~ planData:', planData);

			setFeedbacks([...planData]);
		}
	}, [getFeedbackQuery.status, getFeedbackQuery.data]);

	const getPlanQuery = useQuery({
		queryKey: ['plan', plan_id, 'pending'],
		enabled: plan_id !== undefined && plan_id !== null,
		queryFn: getPlan,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getPlanQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPlanQuery.error:', getPlanQuery.error);
			toast.custom(
				<InfoToast
					message={
						getPlanQuery.error?.response?.data?.message ||
						getPlanQuery.error.message ||
						'Error getting plan'
					}
				/>,
				{
					id: 'getPlan',
				}
			);
		}
	}, [getPlanQuery.status, getPlanQuery.error]);

	useMemo(() => {
		if (getPlanQuery.status === 'success') {
			console.log('🚀 ~ useMemo ~ getPlan', getPlanQuery.data);
			const planData = getPlanQuery.data?.data?.data[0]?.planData || [];
			if (planData.length > 0) {
				setUpdate(true);
			}
			setRows([...planData]);
		}
	}, [getPlanQuery.status, getPlanQuery.data]);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmUpdate, setConfirmUpdate] = useState(false);

	const closeConfirm = () => {
		setConfirmOpen(false);
		setConfirmUpdate(false);
	};

	const queryClient = useQueryClient();

	const addPlanMut = useMutation({
		mutationFn: addStrategicPlan,
		mutationKey: ['addPlan'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success(response.status);
			queryClient.invalidateQueries({ queryKey: ['plans'] });
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const updatePlanMut = useMutation({
		mutationFn: updatePlan,
		mutationKey: ['updatePlan'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success('Update ' + response.status);
			queryClient.invalidateQueries({ queryKey: ['plans'] });
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handlePlanUpdate = () => {
		const { year, department, plan_document, planData } = planFormik.values;
		const data = {
			year: year,
			department: department,
			plan_document: plan_document,
			planData: planData,
			status: 'submitted',
			plan_id: plan_id,
		};
		console.log('🚀 ~ handlePlanUpdate ~ data:', data);

		updatePlanMut.mutate(data);
	};

	const handlePlanSubmit = (values) => {
		const { year, department, plan_document, planData, status } = values;
		const data = {
			year: year,
			department: department,
			plan_document: plan_document,
			planData: planData,
			status: status,
		};
		console.log('🚀 ~ handlePlanSubmit ~ data:', data);

		addPlanMut.mutate(data);
	};

	const planFormik = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: user.r_data,
			plan_document: null,
			planData: [...rows],
			status: 'submitted',
		},
		validationSchema: createPlanSchema,
		onSubmit: handlePlanSubmit,
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
				Create {getDepartmentByRole(user.r_data)} Plans
			</Typography>
			<Grid2
				container
				display="flex"
				justifyContent="flex-start"
				alignItems="center"
				width="100%"
				gap={1}
				component="form"
				onSubmit={planFormik.handleSubmit}
				autoComplete="off"
				noValidate
			>
				<Grid2 size={{ xs: 12 }} display="flex" alignItems="flex-end" pl="85%" maxHeight="fit-content">
					{update ? (
						<Button
							onClick={() => {
								setConfirmUpdate(true);
							}}
							fullWidth
							variant="contained"
							size="large"
						>
							Update Plan
						</Button>
					) : (
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
					)}

					<ConfirmationModal
						open={confirmUpdate}
						onCancel={closeConfirm}
						onConfirm={() => {
							planFormik.validateForm();
							handlePlanUpdate();
							setConfirmUpdate(false);
						}}
						title="Update Plan"
						message="Are you sure you want to update this plan?"
					/>

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
							{ value: 'av', label: getDepartmentByRole('av') },
							{ value: 'vpo', label: getDepartmentByRole('vpo') },
							{ value: 'rv', label: getDepartmentByRole('rv') },
							{ value: 'ado', label: getDepartmentByRole('ado') },
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
					<Typography variant="h6" component="p" fontWeight="bold" color={colors.textBlue[500]}>
						Plan for {planFormik.values.year}
					</Typography>
				</Grid2>
				<Grid2 size={{ xs: 12 }} pl={2} display="flex" maxHeight="fit-content">
					<Typography variant="body1" component="p" color={colors.redAccent[500]}>
						Feedbacks
					</Typography>
				</Grid2>
				{feedbacks.length === 0 && (
					<Typography variant="body2" component="p" color={colors.textBlue[500]}>
						No feedbacks given
					</Typography>
				)}
				{feedbacks.map((feedback) => (
					<Grid2
						size={{ xs: 3.8 }}
						border={1.5}
						borderRadius={1}
						borderColor={colors.redAccent[400]}
						bgcolor={colors.redAccent[700]}
						p={1}
						display="flex"
						maxHeight="fit-content"
						minHeight={100}
					>
						<Typography variant="body2" component="p" color={colors.textBlue[500]}>
							{feedback.message}
						</Typography>
					</Grid2>
				))}
			</Grid2>

			<CreatePlanTable rows={rows} setRows={setRows} year={planFormik.values.year} />
		</Stack>
	);
}

export default OPlan;
