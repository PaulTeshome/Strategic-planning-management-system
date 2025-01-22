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

function CreatePlanTable({ rows, setRows, year }) {
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
		localStorage.setItem(`plan ${year}`, JSON.stringify(rows));
		toast.success('Plan Saved Successfully!');
		console.log(rows);
	};

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
			main_goal: '',
			weight: '',
			main_functions: [],
		};

		setRows((prev) => [...prev, newGoal]);
	};

	const addMain = (main_functions, goalNumber) => {
		const functionNumber = main_functions.length + 1;
		const newMainFunction = {
			number: goalNumber + '.' + functionNumber,
			main_func_title: '',
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
			detail_func_title: '',
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
		// console.log('🚀 ~ addKPI ~ detailNumber:', detailNumber);
		const kpiNumber = kpi.length + 1;
		const [goalNumber, functionNumber] = detailNumber.split('.');
		// console.log(
		// '🚀 ~ addKPI ~ goalNumber, functionNumber, detailNumber:',
		// goalNumber,
		// functionNumber,
		// detailNumber
		// );
		const newKPI = {
			number: detailNumber + '.' + kpiNumber,
			KPI_title: '',
			weight: '',
			measurement: '',
			past_year: '',
			present_goal: '',
			quarter_1: '',
			quarter_2: '',
			quarter_3: '',
			quarter_4: '',
			department: user.r_data,
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

	const reassignNumbers = (items, parentNumber = '') => {
		return items.map((item, index) => {
			const newNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}`;
			const updatedItem = { ...item, number: newNumber };

			// Recursively update nested structures
			if (item.main_functions) {
				updatedItem.main_functions = reassignNumbers(item.main_functions, newNumber);
			}
			if (item.detail_functions) {
				updatedItem.detail_functions = reassignNumbers(item.detail_functions, newNumber);
			}
			if (item.KPIs) {
				updatedItem.KPIs = reassignNumbers(item.KPIs, newNumber);
			}

			return updatedItem;
		});
	};

	const removeGoal = (goalNumber) => {
		setRows((prevRows) => reassignNumbers(prevRows.filter((goal) => goal.number !== goalNumber)));
	};

	const removeMain = (goalNumber, functionNumber) => {
		setRows((prevRows) =>
			reassignNumbers(
				prevRows.map((goal) => {
					if (goal.number === goalNumber) {
						return {
							...goal,
							main_functions: goal.main_functions.filter((main) => main.number !== functionNumber),
						};
					}
					return goal;
				})
			)
		);
	};

	const removeDetail = (goalNumber, functionNumber, detailNumber) => {
		setRows((prevRows) =>
			reassignNumbers(
				prevRows.map((goal) => {
					if (goal.number === goalNumber) {
						return {
							...goal,
							main_functions: goal.main_functions.map((main) => {
								if (main.number === goalNumber + '.' + functionNumber) {
									console.log(
										'🚀 ~ main_functions:goal.main_functions.map ~ functionNumber:',
										functionNumber
									);
									return {
										...main,
										detail_functions: main.detail_functions.filter(
											(detail) => detail.number !== detailNumber
										),
									};
								}
								return main;
							}),
						};
					}
					return goal;
				})
			)
		);
	};

	const removeKPI = (goalNumber, functionNumber, detailNumber, kpiNumber) => {
		setRows((prevRows) =>
			reassignNumbers(
				prevRows.map((goal) => {
					if (goal.number === goalNumber) {
						return {
							...goal,
							main_functions: goal.main_functions.map((main) => {
								if (main.number === goalNumber + '.' + functionNumber) {
									return {
										...main,
										detail_functions: main.detail_functions.map((detail) => {
											if (
												detail.number ===
												goalNumber + '.' + functionNumber + '.' + detailNumber
											) {
												return {
													...detail,
													KPIs: detail.KPIs.filter((kpi) => kpi.number !== kpiNumber),
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
					return goal;
				})
			)
		);
	};

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
				quarter_1_name = `quarter_1_` + item.number.replace(/\./g, '_');
				quarter_2_name = `quarter_2_` + item.number.replace(/\./g, '_');
				quarter_3_name = `quarter_3_` + item.number.replace(/\./g, '_');
				quarter_4_name = `quarter_4_` + item.number.replace(/\./g, '_');
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

			const TitleFieldLabel = textLabel + ' Title ' + item.number;
			const TitleFieldName = textName + '_' + item.number.replace(/\./g, '_');
			console.log('🚀 ~ renderRow ~ textName:', textName);
			const WeightFieldLabel = textLabel + ' Weight ' + item.number;
			const WeightFieldName = textName + '_weight_' + item.number.replace(/\./g, '_');

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

			console.log('🚀 ~ renderRow ~ ', item);

			tableRows.push(
				<Formik
					key={TitleFieldName}
					onSubmit={handleRowSubmit}
					initialValues={{
						[TitleFieldName]: item[textName],
						[WeightFieldName]: item.weight,
						...KPIinitials,
					}}
					validationSchema={yup.object().shape({
						[TitleFieldName]: yup.string().required(`${TitleFieldLabel} is required`),
						[WeightFieldName]: yup
							.number()
							.required(`${WeightFieldLabel} is required`)
							.min(0, 'Weight cannot be negative'),
						...KPIValidations,
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
										item[textName] = event.target.value;
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
									<Stack direction="row" display="flex">
										<Button
											sx={{ flex: 6 }}
											onClick={() => {
												submitForm();
												if (
													Object.keys(errors).length === 0 &&
													touched[TitleFieldName] &&
													touched[WeightFieldName]
												) {
													addMain(item.main_functions, item.number);
												}
											}}
											fullWidth
											variant="text"
											startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
											size="small"
										>
											Add Main Function
										</Button>
										<Delete
											sx={{
												color: colors.redAccent[400],
												'&:hover': { color: colors.redAccent[200] },
												flex: 1,
											}}
											onClick={() => {
												removeGoal(item.number);
											}}
										/>
									</Stack>
								</TableBodyCell>
							)}

							{item.main_func_title !== undefined && (
								<TableBodyCell colSpan={8}>
									<Stack direction="row" display="flex">
										<Button
											sx={{ flex: 6 }}
											onClick={() => {
												submitForm();
												if (
													Object.keys(errors).length === 0 &&
													touched[TitleFieldName] &&
													touched[WeightFieldName]
												) {
													addDetail(item.detail_functions, item.number);
												}
											}}
											fullWidth
											variant="text"
											startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
											size="small"
										>
											Add Detail Function
										</Button>
										<Delete
											sx={{
												color: colors.redAccent[400],
												'&:hover': { color: colors.redAccent[200] },
												flex: 1,
											}}
											onClick={() => {
												const num = item.number.split('.');
												removeMain(num[0], item.number);
											}}
										/>
									</Stack>
								</TableBodyCell>
							)}

							{item.detail_func_title !== undefined && (
								<TableBodyCell colSpan={8}>
									<Stack direction="row" display="flex">
										<Button
											sx={{ flex: 6 }}
											onClick={() => {
												submitForm();
												if (
													Object.keys(errors).length === 0 &&
													touched[TitleFieldName] &&
													touched[WeightFieldName]
												) {
													addKPI(item.KPIs, item.number);
												}
											}}
											fullWidth
											variant="text"
											startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
											size="small"
										>
											Add KPI
										</Button>
										<Delete
											sx={{
												color: colors.redAccent[400],
												'&:hover': { color: colors.redAccent[200] },
												flex: 1,
											}}
											onClick={() => {
												const num = item.number.split('.');
												// console.log('🚀 ~ renderRow ~ num:', num);
												removeDetail(num[0], num[1], item.number);
											}}
										/>
									</Stack>
								</TableBodyCell>
							)}

							{isKPI && (
								<>
									<TableBodyCell>
										<SelectComponent
											required={true}
											touched={touched[measurement_name]}
											error={errors[measurement_name]}
											label="Measurement"
											value={values[measurement_name] || ''}
											name={measurement_name}
											onChange={(event) => {
												item.measurement = event.target.value;
												setFieldValue(measurement_name, event.target.value);
											}}
											onBlur={handleBlur}
											helperText={touched[measurement_name] && errors[measurement_name]}
											options={[
												{ value: 'number', label: 'Number' },
												{ value: 'percent', label: 'Percent' },
												{ value: 'money', label: 'Money' },
											]}
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
											label="Past Year Value"
											name={past_year_name}
											onBlur={handleBlur}
											onChange={(event) => {
												item.past_year = event.target.value;
												setFieldValue(past_year_name, event.target.value);
											}}
											value={values[past_year_name]}
											error={touched[past_year_name] && Boolean(errors[past_year_name])}
											helperText={touched[past_year_name] && errors[past_year_name]}
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
											label="Present Goal"
											name={present_goal_name}
											onBlur={handleBlur}
											onChange={(event) => {
												item.present_goal = event.target.value;
												setFieldValue(present_goal_name, event.target.value);
											}}
											value={values[present_goal_name]}
											error={touched[present_goal_name] && Boolean(errors[present_goal_name])}
											helperText={touched[present_goal_name] && errors[present_goal_name]}
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
											label="Quarter 1"
											name={quarter_1_name}
											onBlur={handleBlur}
											onChange={(event) => {
												item.quarter_1 = event.target.value;
												setFieldValue(quarter_1_name, event.target.value);
											}}
											value={values[quarter_1_name]}
											error={touched[quarter_1_name] && Boolean(errors[quarter_1_name])}
											helperText={touched[quarter_1_name] && errors[quarter_1_name]}
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
											label="Quarter 2"
											name={quarter_2_name}
											onBlur={handleBlur}
											onChange={(event) => {
												item.quarter_2 = event.target.value;
												setFieldValue(quarter_2_name, event.target.value);
											}}
											value={values[quarter_2_name]}
											error={touched[quarter_2_name] && Boolean(errors[quarter_2_name])}
											helperText={touched[quarter_2_name] && errors[quarter_2_name]}
										/>
									</TableBodyCell>
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
												item.quarter_3 = event.target.value;
												setFieldValue(quarter_3_name, event.target.value);
											}}
											value={values[quarter_3_name]}
											error={touched[quarter_3_name] && Boolean(errors[quarter_3_name])}
											helperText={touched[quarter_3_name] && errors[quarter_3_name]}
										/>
									</TableBodyCell>
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
												item.quarter_4 = event.target.value;
												setFieldValue(quarter_4_name, event.target.value);
											}}
											value={values[quarter_4_name]}
											error={touched[quarter_4_name] && Boolean(errors[quarter_4_name])}
											helperText={touched[quarter_4_name] && errors[quarter_4_name]}
										/>
									</TableBodyCell>
									<TableBodyCell>
										<Stack direction="row" display="flex" alignItems="center">
											<Typography sx={{ flex: 2 }} variant="caption">
												{getDepartmentByRole(item.department)}
											</Typography>

											<Delete
												sx={{
													color: colors.redAccent[400],
													'&:hover': { color: colors.redAccent[200] },
													flex: 1,
												}}
												onClick={() => {
													const num = item.number.split('.');
													console.log('🚀 ~ renderRow ~ num:', num);
													console.log('🚀 ~ renderRow ~ num:', item);
													removeKPI(num[0], num[1], num[2], item.number);
												}}
											/>
										</Stack>
									</TableBodyCell>
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
					disabled={isPreviousYear}
					variant="contained"
					startIcon={<Save sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					// sx={{ bgcolor: colors.aastuGold[500], color: colors.aastuBlue[500] }}
					onClick={handleLocalSave}
					size="medium"
				>
					Save Plan
				</Button>
			</Grid2>
			<Grid2 size={{ xs: 1.5 }} display="flex" alignItems="flex-end" maxHeight="fit-content">
				<Button
					disabled={isPreviousYear}
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
