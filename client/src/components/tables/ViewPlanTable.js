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
			borderRight: '1px solid white',
		},
	}));
	// const StyledTableCell = styled(TableCell)(({ theme }) => ({
	// 	[`&.${tableCellClasses.head}`]: {
	// 		backgroundColor: colors.aastuBlue[500],
	// 		color: 'white',
	// 		fontWeight: 'bold',
	// 		fontSize: '10px',
	// 		width: 190,
	// 		borderRight: '1px solid white',
	// 		// "&:first-of-type": { width: 20 },
	// 	},
	// 	[`&.${tableCellClasses.body}`]: {
	// 		fontWeight: 'bold',
	// 		// "&:first-of-type": { width: 20 },
	// 	},
	// }));

	const FirstColTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.body}`]: {
			fontWeight: 'bold',
			fontSize: '10px',
		},
	}));
	const TableBodyCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.body}`]: {
			fontSize: '10px',
		},
	}));
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(even)': {
			backgroundColor: 'lightblue',
		},
		// hide last border
		'&:hover': {
			backgroundColor: '#4CAFB2',
		},
		'&:last-child td, &:last-child th': {
			border: 0,
		},
		'&.goal': {
			backgroundColor: colors.aastuGold[500],
		},
	}));
	return (
		<TableContainer component={Paper}>
			<Table size="small" stickyHeader sx={{ tableLayout: 'auto' }} aria-label="ANC table">
				<TableHead>
					<StyledTableRow>
						<GroupedTableCell align="center" colSpan={13}>
							ANC Contact
						</GroupedTableCell>
						<GroupedTableCell align="center" colSpan={6}>
							HIV assessment and follow up
						</GroupedTableCell>
						<GroupedTableCell align="center" colSpan={4}>
							Partner test
						</GroupedTableCell>
						<GroupedTableCell align="center" colSpan={5}>
							Counseling on
						</GroupedTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody>
					<StyledTableRow
						className="goal"
						// // onClick={() => {
						// // 	setVisitForm(index);
						// // }}
						// // key={index}
						// sx={{
						// 	'&:last-child td, &:last-child th': { border: 0 },
						// 	'&:hover': {
						// 		cursor: 'pointer',
						// 	},
						// }}
					>
						<FirstColTableCell>hello</FirstColTableCell>
						<TableBodyCell>there</TableBodyCell>
					</StyledTableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ViewPlanTable;
