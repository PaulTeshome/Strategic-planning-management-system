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
import React, { useContext } from 'react';
import { tokens } from '../../theme';
import { Add, Delete, Save } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyContext from '../../utils/MyContext';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import SelectComponent from '../form/SelectComponent';
import toast from 'react-hot-toast';

function CreateReportTable({ rows, setRows, year }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { user } = useContext(MyContext);

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
				// console.log('🚀 ~ handleRowSubmit ~ value:', value);
				// console.log('🚀 ~ handleRowSubmit ~ value:', rows);
			};

			const KPIinitials = isKPI
				? {
						[measurement_name]: item.measurement,
						[past_year_name]: item.past_year,
						[present_goal_name]: item.present_goal,
						[quarter_1_name]: item.quarter_1,
						[quarter_2_name]: item.quarter_2,
						[quarter_3_name]: item.quarter_3,
						[quarter_4_name]: item.quarter_4,
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

			const progressSum =
				parseFloat(item.quarter_1_progress) +
				parseFloat(item.quarter_2_progress) +
				parseFloat(item.quarter_3_progress) +
				parseFloat(item.quarter_4_progress);

			console.log('🚀 ~ renderRow ~ progressSum:', progressSum);

			const goalSum =
				parseFloat(item.quarter_1) +
				parseFloat(item.quarter_2) +
				parseFloat(item.quarter_3) +
				parseFloat(item.quarter_4);
			console.log('🚀 ~ renderRow ~ progressSum:', progressSum);

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
					{({ values, errors, touched, handleBlur, handleChange, submitForm, setFieldValue }) => (
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
									</TableBodyCell>
									<TableBodyCell>{item.quarter_2}</TableBodyCell>
									<TableBodyCell>
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
									</TableBodyCell>
									<TableBodyCell>{item.quarter_3}</TableBodyCell>
									<TableBodyCell>
										{' '}
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
									</TableBodyCell>
									<TableBodyCell>{item.quarter_4}</TableBodyCell>
									<TableBodyCell>
										{' '}
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
									</TableBodyCell>
									<TableBodyCell colSpan={0.5}>{(progressSum / goalSum) * 100}%</TableBodyCell>
									<TableBodyCell>{getDepartmentByRole(item.department)}</TableBodyCell>
								</>
							)}
						</StyledTableRow>
					)}
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
			<Grid2 size={{ xs: 12 }} display="flex" pl={'80%'} alignItems="flex-end" maxHeight="fit-content">
				<Button
					type="submit"
					fullWidth
					disabled={isPreviousYear}
					variant="contained"
					startIcon={<Save sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
					onClick={handleLocalSave}
					size="medium"
				>
					Save Report
				</Button>
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
