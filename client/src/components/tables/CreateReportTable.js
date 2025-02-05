import { useTheme } from '@emotion/react';
import {
	Button,
	Grid2,
	Paper,
	Stack,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { Add, Delete, Save, Upload } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyContext from '../../utils/MyContext';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import SelectComponent from '../form/SelectComponent';
import toast from 'react-hot-toast';
import useReportApi from '../../api/report';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConfirmationModal from '../modals/ConfirmationModal';
import usePlanApi from '../../api/plan';

function CreateReportTable({ rows, onCancel, setRows, year, reportData }) {
	console.log('🚀 ~ CreateReportTable ~ rows:', rows);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { user } = useContext(MyContext);

	const { getBy } = usePlanApi();
	const { addReport, updateReport } = useReportApi();
	const queryClient = useQueryClient();
	const [update, setUpdate] = useState(true);

	// const [rows, setrows] = useState([]);

	const getByYearnDeptQ = useQuery({
		// queryKey: ['report', year, user.r_data, 'submitted'],
		queryKey: ['plan', year, user.r_data, 'approved'],
		queryFn: getBy,
		staleTime: 1000 * 60 * 5,
		retry: false,
		enabled: rows.length === 0,
	});

	useEffect(() => {
		if (getByYearnDeptQ.status === 'error') {
			// // // console.log('🚀 ~ Patients ~ getByYearnDeptQ.error:', getByYearnDeptQ.error);
			toast.error(
				getByYearnDeptQ.error?.response?.data?.message || getByYearnDeptQ.error.message || 'Error getting plans'
			);
		}
	}, [getByYearnDeptQ.status, getByYearnDeptQ.error]);

	useMemo(() => {
		if (getByYearnDeptQ.status === 'success') {
			// // console.log('🚀 ~ useMemo ~ getReport', getByYearnDeptQ.data);
			const planData = getByYearnDeptQ.data?.data?.data[0]?.planData || [...rows];
			const repData = getByYearnDeptQ.data?.data?.data[0];
			console.log('🚀 ~ useMemo ~ plaData:  at creTable', repData);
			setRows([...planData]);
			// setrows([...planData]);
			if (repData !== null && repData !== undefined) {
				setUpdate(false);
			}
			// setReportData({ ...repData });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getByYearnDeptQ.status, getByYearnDeptQ.data]);

	const date = new Date();
	const presentYear = date.getFullYear();
	const isPreviousYear = year < presentYear;

	const GroupedTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: colors.aastuBlue[500],
			color: 'white',
			fontWeight: 'bold',
			fontSize: '10px',
			borderRight: `1px solid ${colors.grey[500]}`,
		},
	}));

	const FirstColTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.body}`]: {
			fontWeight: 'bold',
			fontSize: '10px',
			borderRight: `1px solid ${colors.grey[500]}`,
		},
	}));

	const TableBodyCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.body}`]: {
			fontSize: '10px',
			borderRight: `1px solid ${colors.grey[500]}`,
		},
	}));

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&.goal': {
			backgroundColor: colors.aastuGold[500],
			'&:hover': { backgroundColor: colors.aastuGold[600] },
		},
		'&.main': {
			backgroundColor: colors.textBlue[200],
			'&:hover': { backgroundColor: colors.textBlue[300] },
		},
		'&.detail': {
			backgroundColor: colors.grey[400],
			'&:hover': { backgroundColor: colors.grey[500] },
		},
		'&.kpi': {
			backgroundColor: colors.grey[200],
			'&:hover': { backgroundColor: colors.grey[300] },
		},
	}));

	const updatePlanMut = useMutation({
		mutationFn: updateReport,
		mutationKey: ['updateReport'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success('Update ' + response.status);
			queryClient.invalidateQueries({ queryKey: ['report'] });
			setUpdate(false);
			onCancel();
			getByYearnDeptQ.refetch();
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handlePlanUpdate = () => {
		console.log('🚀 ~ handlePlanUpdate ~ reportData;:', reportData);

		const data = {
			year: year,
			department: user.r_data,
			plan_document: null,
			planData: [...rows],
			status: 'submitted',
			report_id: reportData._id,
		};

		updatePlanMut.mutate(data);
	};

	const addReportMut = useMutation({
		mutationFn: addReport,
		mutationKey: ['addReport'],
		onSuccess: (response) => {
			// // // // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success(response.status);
			queryClient.invalidateQueries({ queryKey: ['reports'] });
			onCancel();
		},
		onError: (error) => {
			// // // // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});
	const handleReportSubmit = (values) => {
		if (rows.length === 0) {
			toast.error('Please insert Report data before submission');
			return;
		}
		const data = {
			year: year,
			department: user.r_data,
			plan_document: null,
			planData: [...rows],
			status: 'submitted',
		};

		addReportMut.mutate(data);
	};

	const handleLocalSave = () => {
		localStorage.setItem(`report ${year}`, JSON.stringify(rows));
		toast.success('Report Saved Successfully!');
		console.log('report', rows);
	};

	const topColumns = [
		{ name: '', colSpan: 10 },
		{ name: 'Quarter 1', colSpan: 2 },
		{ name: 'Quarter 2', colSpan: 2 },
		{ name: 'Quarter 3', colSpan: 2 },
		{ name: 'Quarter 4', colSpan: 2 },
	];
	const columns = [
		{ name: 'Number', colSpan: 1 },
		{ name: 'Titles', colSpan: 5 },
		{ name: 'Weights', colSpan: 1 },
		{ name: 'Measurements', colSpan: 1 },
		{ name: `Previous year(${year - 1}) value`, colSpan: 1 },
		{ name: `This year(${year}) Goal`, colSpan: 1 },
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
	];

	const renderTableRows = (rows) => {
		const tableRows = [];
		const date = Date();

		const renderRow = (item, level = 0) => {
			const isKPI = item.KPI_title !== undefined;

			let className = '';
			let textLabel = '';
			let textName = '';

			let measurement_name = '';
			let past_year_name = '';
			let present_goal_name = '';
			let quarter_1_name = '';
			let quarter_2_name = '';
			let quarter_3_name = '';
			let quarter_4_name = '';
			// let department_name = '';

			if (item.KPI_title !== undefined) {
				// // // console.log('🚀 ~ renderRow ~ item:', item);

				className = 'kpi';
				textLabel = 'KPI';
				textName = 'KPI_title';
				measurement_name = `measurement_` + item.number.replace(/\./g, '_');
				past_year_name = `past_year_` + item.number.replace(/\./g, '_');
				present_goal_name = `present_goal_` + item.number.replace(/\./g, '_');
				quarter_1_name = `quarter_1_progress_` + item.number.replace(/\./g, '_');
				quarter_2_name = `quarter_2_progress_` + item.number.replace(/\./g, '_');
				quarter_3_name = `quarter_3_progress_` + item.number.replace(/\./g, '_');
				quarter_4_name = `quarter_4_progress_` + item.number.replace(/\./g, '_');
				// department_name = `department_` + item.number.replace(/\./g, '_');
			} else if (item.detail_func_title !== undefined) {
				className = 'detail';
				textLabel = 'Detail Function ';
				textName = 'detail_func_title';
			} else if (item.main_func_title !== undefined) {
				className = 'main';
				textLabel = 'Main Function';
				textName = 'main_func_title';
			} else if (item.main_goal !== undefined) {
				className = 'goal';
				textLabel = 'Main Goal';
				textName = 'main_goal';
			}

			const TitleFieldName = textName + '_' + item.number.replace(/\./g, '_');

			const handleRowSubmit = (value) => {
				// // // console.log('🚀 ~ handleRowSubmit ~ value:', value);
				// // // console.log('🚀 ~ handleRowSubmit ~ value:', rows);
			};

			const Q1_pastDue = new Date(reportData.quarter_1_due_date).getTime() < Date.now();
			// // console.log('🚀 ~ renderRow ~ Q1_pastDue:', Q1_pastDue);
			const Q2_pastDue = new Date(reportData.quarter_2_due_date).getTime() < Date.now();
			// // console.log('🚀 ~ renderRow ~ Q2_pastDue:', Q2_pastDue);
			const Q3_pastDue = new Date(reportData.quarter_3_due_date).getTime() < Date.now();
			const Q4_pastDue = new Date(reportData.quarter_4_due_date).getTime() < Date.now();

			const Q2_hasDue = reportData.quarter_2_due_date !== undefined && reportData.quarter_2_due_date !== null;
			// // console.log('🚀 ~ renderRow ~ Q2_hasDue:', Q2_hasDue);
			const Q3_hasDue = reportData.quarter_3_due_date !== undefined && reportData.quarter_3_due_date !== null;
			const Q4_hasDue = reportData.quarter_4_due_date !== undefined && reportData.quarter_4_due_date !== null;

			const KPIinitials = isKPI
				? {
						[measurement_name]: item.measurement,
						[past_year_name]: item.past_year,
						[present_goal_name]: item.present_goal,
						[quarter_1_name]: item?.quarter_1_progress || 0,
						[quarter_2_name]: item?.quarter_2_progress || 0,
						[quarter_3_name]: item?.quarter_3_progress || 0,
						[quarter_4_name]: item?.quarter_4_progress || 0,
					}
				: {};

			const KPIValidations = isKPI
				? {
						[measurement_name]: yup.string().required(`required`),
						[past_year_name]: yup.number().required(`required`),
						[present_goal_name]: yup.number().required(`required`),
						[quarter_1_name]: yup.number().required(`required`),
						[quarter_2_name]: yup.number().required(`required`),
						[quarter_3_name]: yup.number().required(`required`),
						[quarter_4_name]: yup.number().required(`required`),
					}
				: {};

			const goalSum =
				parseFloat(item.quarter_1) +
				parseFloat(item.quarter_2) +
				parseFloat(item.quarter_3) +
				parseFloat(item.quarter_4);

			tableRows.push(
				<Formik
					key={TitleFieldName}
					onSubmit={handleRowSubmit}
					initialValues={{
						...KPIinitials,
					}}
					validationSchema={yup.object().shape({
						...KPIValidations,
					})}
				>
					{({ values, errors, touched, handleBlur, handleChange, submitForm, setFieldValue }) => {
						const performancePercentage =
							((parseFloat(values[quarter_1_name]) +
								parseFloat(values[quarter_2_name]) +
								parseFloat(values[quarter_3_name]) +
								parseFloat(values[quarter_4_name])) /
								goalSum) *
							100;
						const performColor =
							performancePercentage > 70
								? 'green'
								: performancePercentage > 50
									? colors.aastuGold[600]
									: 'red';
						return (
							<StyledTableRow key={TitleFieldName} className={className}>
								<FirstColTableCell style={{ paddingLeft: `${level * 2 + 10}px` }}>
									{item.number}
								</FirstColTableCell>
								<TableBodyCell colSpan={!isKPI ? 19 : 6} style={{ paddingLeft: `${level * 2 + 10}px` }}>
									{item[textName]}
									{` (Weight = ${item.weight})`}
								</TableBodyCell>

								{isKPI && (
									<>
										<TableBodyCell>{item.measurement}</TableBodyCell>
										<TableBodyCell>{item.past_year}</TableBodyCell>
										<TableBodyCell>{item.present_goal}</TableBodyCell>
										<TableBodyCell>{item.quarter_1}</TableBodyCell>
										<TableBodyCell>
											{Q1_pastDue ? (
												<Typography>{values[quarter_1_name]}</Typography>
											) : (
												<TextField
													slotProps={{
														inputLabel: { shrink: true },
													}}
													fullWidth
													size="small"
													type="number"
													label="Quarter 1"
													name={quarter_1_name}
													onBlur={handleBlur}
													onChange={(event) => {
														item.quarter_1_progress = event.target.value;
														setFieldValue(quarter_1_name, event.target.value);
													}}
													value={values[quarter_1_name]}
													error={touched[quarter_1_name] && Boolean(errors[quarter_1_name])}
													helperText={touched[quarter_1_name] && errors[quarter_1_name]}
												/>
											)}
										</TableBodyCell>
										<TableBodyCell>{item.quarter_2}</TableBodyCell>
										<TableBodyCell>
											{Q2_pastDue || !Q2_hasDue ? (
												<Typography>{values[quarter_2_name]}</Typography>
											) : (
												<TextField
													slotProps={{
														inputLabel: { shrink: true },
													}}
													fullWidth
													size="small"
													type="number"
													label="Quarter 2"
													name={quarter_2_name}
													onBlur={handleBlur}
													onChange={(event) => {
														item.quarter_2_progress = event.target.value;
														setFieldValue(quarter_2_name, event.target.value);
													}}
													value={values[quarter_2_name]}
													error={touched[quarter_2_name] && Boolean(errors[quarter_2_name])}
													helperText={touched[quarter_2_name] && errors[quarter_2_name]}
												/>
											)}
										</TableBodyCell>
										<TableBodyCell>{item.quarter_3}</TableBodyCell>
										<TableBodyCell>
											{Q3_pastDue || !Q3_hasDue ? (
												<Typography>{values[quarter_3_name]}</Typography>
											) : (
												<TextField
													slotProps={{
														inputLabel: { shrink: true },
													}}
													fullWidth
													size="small"
													type="number"
													label="Quarter 3"
													name={quarter_3_name}
													onBlur={handleBlur}
													onChange={(event) => {
														item.quarter_3_progress = event.target.value;
														setFieldValue(quarter_3_name, event.target.value);
													}}
													value={values[quarter_3_name]}
													error={touched[quarter_3_name] && Boolean(errors[quarter_3_name])}
													helperText={touched[quarter_3_name] && errors[quarter_3_name]}
												/>
											)}
										</TableBodyCell>
										<TableBodyCell>{item.quarter_4}</TableBodyCell>
										<TableBodyCell>
											{Q4_pastDue || !Q4_hasDue ? (
												<Typography>{values[quarter_4_name]}</Typography>
											) : (
												<TextField
													slotProps={{
														inputLabel: { shrink: true },
													}}
													fullWidth
													size="small"
													type="number"
													label="Quarter 4"
													name={quarter_4_name}
													onBlur={handleBlur}
													onChange={(event) => {
														item.quarter_4_progress = event.target.value;
														setFieldValue(quarter_4_name, event.target.value);
													}}
													value={values[quarter_4_name]}
													error={touched[quarter_4_name] && Boolean(errors[quarter_4_name])}
													helperText={touched[quarter_4_name] && errors[quarter_4_name]}
												/>
											)}
										</TableBodyCell>
										<TableBodyCell colSpan={0.5}>
											<Typography color={performColor} fontWeight="bold">
												{performancePercentage}%
											</Typography>
										</TableBodyCell>
										<TableBodyCell>{getDepartmentByRole(item.department)}</TableBodyCell>
									</>
								)}
							</StyledTableRow>
						);
					}}
				</Formik>
			);

			if (item.main_functions) {
				item.main_functions.forEach((func) => renderRow(func, level + 1));
			}
			if (item.detail_functions) {
				item.detail_functions.forEach((detailFunc) => renderRow(detailFunc, level + 2));
			}
			if (item.KPIs) {
				item.KPIs.forEach((kpi) => renderRow(kpi, level + 3));
			}
		};

		rows.forEach((item) => renderRow(item));
		return tableRows;
	};

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmUpdate, setConfirmUpdate] = useState(false);

	const closeConfirm = () => {
		setConfirmOpen(false);
		setConfirmUpdate(false);
	};
	return (
		<Grid2
			container
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			gap={1}
			// component="form"
			// onSubmit={planDataFormik.handleSubmit}
			// autoComplete="off"
			// noValidate
		>
			<Grid2 size={{ xs: 7.8 }}></Grid2>
			<Grid2 size={{ xs: 2 }} display="flex" alignItems="flex-end" maxHeight="fit-content">
				<Button
					type="submit"
					fullWidth
					disabled={isPreviousYear}
					variant="contained"
					startIcon={<Save sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
					onClick={() => handleLocalSave()}
					size="medium"
				>
					Save Report
				</Button>
			</Grid2>
			<Grid2 size={{ xs: 2 }} display="flex" alignItems="flex-end" maxHeight="fit-content">
				{update ? (
					<Button
						onClick={() => {
							setConfirmUpdate(true);
						}}
						fullWidth
						variant="contained"
						size="large"
					>
						Update Report
					</Button>
				) : (
					<Button
						type="submit"
						fullWidth
						disabled={isPreviousYear}
						variant="contained"
						startIcon={<Upload sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
						onClick={() => {
							setConfirmOpen(true);
						}}
						size="medium"
					>
						Submit Report
					</Button>
				)}

				<ConfirmationModal
					open={confirmUpdate}
					onCancel={closeConfirm}
					onConfirm={() => {
						handlePlanUpdate();
						setConfirmUpdate(false);
					}}
					title="Update report"
					message="Are you sure you want to update this report?"
				/>

				<ConfirmationModal
					open={confirmOpen}
					onCancel={closeConfirm}
					onConfirm={() => {
						handleReportSubmit();
						setConfirmOpen(false);
					}}
					title="Submit Report"
					message="Are you sure you want to submit this report?"
				/>
			</Grid2>
			<Grid2 size={{ xs: 12 }} sx={{ overflowY: 'auto' }}>
				<TableContainer component={Paper}>
					<Table size="small" stickyHeader sx={{ tableLayout: 'auto' }} aria-label="ANC table">
						<TableHead>
							<StyledTableRow>
								{topColumns.map((column, i) => (
									<GroupedTableCell key={i} align="center" colSpan={column.colSpan}>
										{column.name}
									</GroupedTableCell>
								))}
							</StyledTableRow>
							<StyledTableRow>
								{columns.map((column, i) => (
									<GroupedTableCell key={i} align="center" colSpan={column.colSpan}>
										{column.name}
									</GroupedTableCell>
								))}
							</StyledTableRow>
						</TableHead>
						<TableBody>{renderTableRows(rows)}</TableBody>
					</Table>
				</TableContainer>
			</Grid2>
		</Grid2>
	);
}

export default CreateReportTable;
