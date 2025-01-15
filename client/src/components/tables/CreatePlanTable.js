import { useTheme } from '@emotion/react';
import {
	Button,
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
import React from 'react';
import { tokens } from '../../theme';
import { Add } from '@mui/icons-material';

function CreatePlanTable({ columns, rows, formikValue, setRows }) {
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
						main_functions: goal.main_functions.map((fn) =>
							fn.number === functionNumber
								? {
										...fn,
										detail_functions: [...fn.detail_functions, newDetailFunction],
									}
								: fn
						),
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
							name={textLabel + '_title_' + item.number}
							onBlur={formikValue.handleBlur}
							onChange={formikValue.handleChange}
							value={formikValue.values.confirm_password}
							error={formikValue.touched.confirm_password && Boolean(formikValue.errors.confirm_password)}
							helperText={formikValue.touched.confirm_password && formikValue.errors.confirm_password}
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
							name={textLabel + '_weight_' + item.number}
							onBlur={formikValue.handleBlur}
							onChange={formikValue.handleChange}
							value={formikValue.values.confirm_password}
							error={formikValue.touched.confirm_password && Boolean(formikValue.errors.confirm_password)}
							helperText={formikValue.touched.confirm_password && formikValue.errors.confirm_password}
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
					)}{' '}
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
	);
}

export default CreatePlanTable;
