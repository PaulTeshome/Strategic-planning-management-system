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

function ViewPlanTable({ columns, rows }) {
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

	const renderTableRows = (data) => {
		const rows = [];

		const renderRow = (item, level = 0) => {
			const isKPI = item.KPI_title !== undefined;

			let className = '';
			if (item.KPI_title) {
				className = 'kpi';
			} else if (item.detail_func_title) {
				className = 'detail';
			} else if (item.main_func_title) {
				className = 'main';
			} else if (item.main_goal) {
				className = 'goal';
			}

			rows.push(
				<StyledTableRow key={item.number} className={className}>
					<FirstColTableCell style={{ paddingLeft: `${level * 2 + 10}px` }}>{item.number}</FirstColTableCell>
					<TableBodyCell style={{ paddingLeft: `${level * 2 + 10}px` }}>
						{item.main_goal || item.main_func_title || item.detail_func_title || item.KPI_title}
					</TableBodyCell>
					<TableBodyCell>{isKPI ? item.weight : item.weight || ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.measurement : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.past_year : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.present_goal : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.quarter_1 : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.quarter_2 : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.quarter_3 : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.quarter_4 : ''}</TableBodyCell>
					<TableBodyCell>{isKPI ? item.department : ''}</TableBodyCell>
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
				<TableBody>
					{renderTableRows(rows)}
					{renderTableRows(rows).length === 0 && (
						<StyledTableRow>
							<TableBodyCell colSpan={11}>
								<Typography textAlign="center">No Plan is Requested for approval yet</Typography>
							</TableBodyCell>
						</StyledTableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ViewPlanTable;
