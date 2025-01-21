import { useTheme } from '@emotion/react';
import {
	Button,
	Grid2,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { Add, Save } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from 'yup';

function CreatePlanTable({ year, planData, setPlanData }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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

	const handleSearch = (e) => {
		console.log('hello');
		console.log('🚀 ~ CreatePlanTable ~ rows:', rows);
	};

	const [rows, setRows] = useState([]);
	console.log('🚀 renderrrrrr');

	const columns = [
		{ name: 'Number', colSpan: 1 },
		{ name: 'Strategic Goals , Main Activities, Detail functions and KPIs', colSpan: 1 },
		{ name: 'Weights', colSpan: 1 },
		{ name: 'Measurements', colSpan: 1 },
		{ name: `Previous year(${year - 1}) value`, colSpan: 1 },
		{ name: `This year(${year}) Goal`, colSpan: 1 },
		{ name: 'Quarter 1', colSpan: 1 },
		{ name: 'Quarter 2', colSpan: 1 },
		{ name: 'Quarter 3', colSpan: 1 },
		{ name: 'Quarter 4', colSpan: 1 },
		{ name: 'Department', colSpan: 1 },
	];

	const addGoal = () => {
		const goalNumber = rows.length + 1;
		const newGoal = {
			number: `${goalNumber}`,
			main_goal: `goal ${goalNumber}`,
			weight: '',
			value: '',
			main_functions: [],
		};

		setRows((prev) => [...prev, newGoal]);
	};

	const addMain = (main_functions, goalNumber) => {
		const functionNumber = main_functions.length + 1;
		const newMainFunction = {
			number: goalNumber + '.' + functionNumber,
			main_func_title: `function ${functionNumber}`,
			weight: '',
			value: '',
			detail_functions: [],
		};

		setRows((prevRows) =>
			prevRows.map((goal) => {
				if (goal.number === goalNumber) {
					// Add new main function to the target goal's main_functions
					return {
						...goal,
						main_functions: [...goal.main_functions, newMainFunction],
					};
				}
				return goal; // Keep other goals unchanged
			})
		);
	};

	const addDetail = (detail, functionNumber) => {
		const detailNumber = detail.length + 1;
		const [goalNumber] = functionNumber.split('.');
		const newDetailFunction = {
			number: functionNumber + '.' + detailNumber,
			detail_func_title: `detail ${detailNumber}`,
			weight: '',
			value: '',
			KPIs: [],
		};

		setRows((prevRows) =>
			prevRows.map((goal) => {
				if (goal.number === goalNumber) {
					return {
						...goal,
						main_functions: goal.main_functions.map((main) => {
							if (main.number === functionNumber) {
								return {
									...main,
									detail_functions: [...main.detail_functions, newDetailFunction],
								};
							}
							return main;
						}),
					};
				}
				return goal; // Keep other goals unchanged
			})
		);
	};

	const addKPI = (kpi, detailNumber) => {
		console.log('🚀 ~ addKPI ~ detailNumber:', detailNumber);
		const kpiNumber = kpi.length + 1;
		const [goalNumber, functionNumber] = detailNumber.split('.');
		console.log(
			'🚀 ~ addKPI ~ goalNumber, functionNumber, detailNumber:',
			goalNumber,
			functionNumber,
			detailNumber
		);
		const newKPI = {
			number: detailNumber + '.' + kpiNumber,
			KPI_title: `kpi ${kpiNumber}`,
			weight: '',
			value: '',
		};

		setRows((prevRows) =>
			prevRows.map((goal) => {
				if (goal.number === goalNumber) {
					return {
						...goal,
						main_functions: goal.main_functions.map((main) => {
							if (main.number === `${goalNumber}.${functionNumber}`) {
								return {
									...main,
									detail_functions: main.detail_functions.map((detail) => {
										if (detail.number === detailNumber) {
											return {
												...detail,
												KPIs: [...detail.KPIs, newKPI],
											};
										}
										return detail;
									}),
								};
							}
							return main;
						}),
					};
				}
				return goal; // Keep other goals unchanged
			})
		);
	};

	const renderTableRows = (rows) => {
		const tableRows = [];

		const renderRow = (item, level = 0) => {
			const isKPI = item.KPI_title !== undefined;

			let className = '';
			let textLabel = '';
			let textName = '';
			if (item.KPI_title) {
				className = 'kpi';
				textLabel = 'KPI';
				textName = 'kpi';
			} else if (item.detail_func_title) {
				className = 'detail';
				textLabel = 'Detail Function ';
				textName = 'detail';
			} else if (item.main_func_title) {
				className = 'main';
				textLabel = 'Main Function';
				textName = 'mainFunc';
			} else if (item.main_goal) {
				className = 'goal';
				textLabel = 'Main Goal';
				textName = 'goal';
			}

			const TitleFieldLabel = textLabel + ' Title ' + item.number;
			const TitleFieldName = textName + '_title_' + item.number.replace(/\./g, '_');
			const WeightFieldLabel = textLabel + ' Weight ' + item.number;
			const WeightFieldName = textName + '_weight_' + item.number.replace(/\./g, '_');

			const handleRowSubmit = (value) => {
				console.log('🚀 ~ handleRowSubmit ~ value:', value);
				console.log('🚀 ~ handleRowSubmit ~ value:', rows);
			};

			tableRows.push(
				<Formik
					key={TitleFieldName}
					onSubmit={handleRowSubmit}
					initialValues={{
						[TitleFieldName]: '',
						[WeightFieldName]: '',
					}}
					validationSchema={yup.object().shape({
						[TitleFieldName]: yup.string().required(`${TitleFieldLabel} is required`),
						[WeightFieldName]: yup
							.number()
							.required(`${WeightFieldLabel} is required`)
							.min(0, 'Weight cannot be negative'),
					})}
				>
					{({ values, errors, touched, handleBlur, handleChange, submitForm, setFieldValue }) => (
						<StyledTableRow key={TitleFieldName} className={className}>
							<FirstColTableCell style={{ paddingLeft: `${level * 2 + 10}px` }}>
								{item.number}
							</FirstColTableCell>
							<TableBodyCell style={{ paddingLeft: `${level * 2 + 10}px` }}>
								<TextField
									slotProps={{
										inputLabel: { shrink: true },
									}}
									fullWidth
									size="small"
									type="text"
									label={TitleFieldLabel}
									name={TitleFieldName}
									onBlur={handleBlur}
									onChange={(event) => {
										item.value = event.target.value;
										setFieldValue(TitleFieldName, event.target.value);
									}}
									value={values[TitleFieldName]}
									error={touched[TitleFieldName] && Boolean(errors[TitleFieldName])}
									helperText={touched[TitleFieldName] && errors[TitleFieldName]}
								/>
							</TableBodyCell>
							<TableBodyCell>
								<TextField
									slotProps={{
										inputLabel: { shrink: true },
									}}
									fullWidth
									size="small"
									type="number"
									label={WeightFieldLabel}
									name={WeightFieldName}
									onBlur={handleBlur}
									onChange={(event) => {
										item.weight = event.target.value;
										setFieldValue(WeightFieldName, event.target.value);
									}}
									value={values[WeightFieldName]}
									error={touched[WeightFieldName] && Boolean(errors[WeightFieldName])}
									helperText={touched[WeightFieldName] && errors[WeightFieldName]}
								/>
							</TableBodyCell>
							{item.main_goal !== undefined && (
								<TableBodyCell colSpan={8}>
									<Button
										onClick={() => {
											submitForm();
											addMain(item.main_functions, item.number);
										}}
										fullWidth
										variant="text"
										startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
										size="small"
									>
										Add Main Function
									</Button>
								</TableBodyCell>
							)}
							{item.main_func_title !== undefined && (
								<TableBodyCell colSpan={8}>
									<Button
										onClick={() => {
											submitForm();
											addDetail(item.detail_functions, item.number);
										}}
										fullWidth
										variant="text"
										startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
										size="small"
									>
										Add Detail Function
									</Button>
								</TableBodyCell>
							)}
							{item.detail_func_title !== undefined && (
								<TableBodyCell colSpan={8}>
									<Button
										onClick={() => {
											submitForm();
											addKPI(item.KPIs, item.number);
										}}
										fullWidth
										variant="text"
										startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
										size="small"
									>
										Add KPI
									</Button>
								</TableBodyCell>
							)}
							{isKPI && (
								<>
									<TableBodyCell>{item.measurement}</TableBodyCell>
									<TableBodyCell>{item.past_year}</TableBodyCell>
									<TableBodyCell>{item.present_goal}</TableBodyCell>
									<TableBodyCell>{item.quarter_1}</TableBodyCell>
									<TableBodyCell>{item.quarter_2}</TableBodyCell>
									<TableBodyCell>{item.quarter_3}</TableBodyCell>
									<TableBodyCell>{item.quarter_4}</TableBodyCell>
									<TableBodyCell>{item.department}</TableBodyCell>
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
			<Grid2 size={{ xs: 10.4 }} display="flex" pl={'70%'} alignItems="flex-end" maxHeight="fit-content">
				<Button
					type="submit"
					fullWidth
					variant="contained"
					startIcon={<Save sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					// sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
					size="medium"
				>
					Save Plan
				</Button>
			</Grid2>
			<Grid2 size={{ xs: 1.5 }} display="flex" alignItems="flex-end" maxHeight="fit-content">
				<Button
					onClick={() => {
						addGoal();
					}}
					fullWidth
					variant="outlined"
					startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					// sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
					size="medium"
				>
					Add Goal
				</Button>
			</Grid2>
			<TableContainer component={Paper}>
				<Table size="small" stickyHeader sx={{ tableLayout: 'auto' }} aria-label="ANC table">
					<TableHead>
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
	);
}

export default CreatePlanTable;
