import { useTheme } from '@emotion/react';
import {
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';

function ViewReportTable({ columns, topColumns, rows }) {
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

	const renderTableRows = (rows) => {
		const tableRows = [];
		const date = Date();

		const renderRow = (item, level = 0) => {
			const isKPI = item.KPI_title !== undefined;

			let className = '';
			let textLabel = '';
			let textName = '';

			// let department_name = '';

			if (item.KPI_title !== undefined) {
				// // // console.log('🚀 ~ renderRow ~ item:', item);

				className = 'kpi';
				textLabel = 'KPI';
				textName = 'KPI_title';

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
			const goalSum =
				parseFloat(item.quarter_1) +
				parseFloat(item.quarter_2) +
				parseFloat(item.quarter_3) +
				parseFloat(item.quarter_4);
			const performancePercentage =
				((parseFloat(item?.quarter_1_progress || 0) +
					parseFloat(item?.quarter_2_progress || 0) +
					parseFloat(item?.quarter_3_progress || 0) +
					parseFloat(item?.quarter_4_progress || 0)) /
					goalSum) *
				100;
			const performColor =
				performancePercentage > 70 ? 'green' : performancePercentage > 50 ? colors.aastuGold[600] : 'red';

			tableRows.push(
				<StyledTableRow key={item.number} className={className}>
					<FirstColTableCell style={{ paddingLeft: `${level * 2 + 10}px` }}>{item.number}</FirstColTableCell>
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
							<TableBodyCell>{item.quarter_1_progress}</TableBodyCell>
							<TableBodyCell>{item.quarter_2}</TableBodyCell>
							<TableBodyCell>{item.quarter_2_progress}</TableBodyCell>
							<TableBodyCell>{item.quarter_3}</TableBodyCell>
							<TableBodyCell>{item.quarter_3_progress}</TableBodyCell>
							<TableBodyCell>{item.quarter_4}</TableBodyCell>
							<TableBodyCell>{item.quarter_4_progress}</TableBodyCell>

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
	);
}

export default ViewReportTable;
