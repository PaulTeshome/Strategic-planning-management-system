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
import { Add } from '@mui/icons-material';
import { useFormik } from 'formik';
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

	const [rows, setRows] = useState([]);
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

	const handleSearch = () => {};

	const createPlanSchema = yup.object().shape({
		year: yup.number().min(1, 'year cannot be negative number').required('Year is required'),
		department: yup.string().required('Department is required'),
		plan_document: yup
			.mixed()
			.nullable() // Allow null
			.required('Plan document is required') // Make optional
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

	const planDataFormik = useFormik({
		initialValues: {
			plan_document: null,
		},
		validationSchema: createPlanSchema,
		onSubmit: handleSearch,
	});

	const addGoal = () => {
		const goalNumber = rows.length + 1;
		const newGoal = {
			number: `${goalNumber}`,
			main_goal: `goal ${goalNumber}`,
			weight: '',
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
			kpi_title: `kpi ${kpiNumber}`,
			weight: '',
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

	const renderTableRows = (data) => {
		const rows = [];

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
				textName = 'detail_func';
			} else if (item.main_func_title) {
				className = 'main';
				textLabel = 'Main Function';
				textName = 'main_func';
			} else if (item.main_goal) {
				className = 'goal';
				textLabel = 'Main Goal';
				textName = 'main_goal';
			}

			rows.push(
				<StyledTableRow key={item.number} className={className}>
					<FirstColTableCell style={{ paddingLeft: `${level * 2 + 10}px` }}>{item.number}</FirstColTableCell>
					<TableBodyCell style={{ paddingLeft: `${level * 2 + 10}px` }}>
						<TextField
							slotProps={{
								inputLabel: { shrink: true },
							}}
							fullWidth
							size="small"
							type="text"
							label={textLabel + ' Title ' + item.number}
							name={textName + '_title_' + item.number}
							onBlur={planDataFormik.handleBlur}
							onChange={planDataFormik.handleChange}
							value={planDataFormik.values[textName + '_title_' + item.number]}
							error={
								planDataFormik.touched[textName + '_title_' + item.number] &&
								Boolean(planDataFormik.errors[textName + '_title_' + item.number])
							}
							helperText={
								planDataFormik.touched[textName + '_title_' + item.number] &&
								planDataFormik.errors[textName + '_title_' + item.number]
							}
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
							label={textLabel + ' Weight ' + item.number}
							name={textName + '_weight_' + item.number}
							onBlur={planDataFormik.handleBlur}
							onChange={planDataFormik.handleChange}
							value={planDataFormik.values[textName + '_weight_' + item.number]}
							error={
								planDataFormik.touched[textName + '_weight_' + item.number] &&
								Boolean(planDataFormik.errors[textName + '_weight_' + item.number])
							}
							helperText={
								planDataFormik.touched[textName + '_weight_' + item.number] &&
								planDataFormik.errors[textName + '_weight_' + item.number]
							}
						/>
					</TableBodyCell>
					{item.main_goal !== undefined && (
						<TableBodyCell colSpan={8}>
							<Button
								onClick={() => {
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

		data.forEach((item) => renderRow(item));
		return rows;
	};
	return (
		<Grid2 container display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
			<Grid2 size={{ xs: 12 }} display="flex" pl="85%" alignItems="flex-end" maxHeight="fit-content">
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
