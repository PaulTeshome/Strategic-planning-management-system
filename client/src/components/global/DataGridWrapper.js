import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

function DataGridWrapper({ children }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			borderRadius="20px"
			bgcolor={colors.white}
			p={{ xs: 2, md: 4 }}
			height="75vh"
			width="100%"
			sx={{
				overflowX: 'auto',
				'& .MuiDataGrid-root': {
					border: 'none',
				},
				'& .MuiDataGrid-columnHeader': {
					backgroundColor: colors.primary[100],
				},
				'& .MuiDataGrid-cell': {
					borderBottom: 'none',
					pl: 2,
				},
				'& .name-column--cell': {
					color: colors.greenAccent[300],
					textWrap: 'wrap',
				},
				'& .MuiDataGrid-columnHeaderTitle': {
					fontWeight: 'bold',
				},

				'& .MuiDataGrid-virtualScroller': {
					backgroundColor: colors.primary[100],
				},

				'& .MuiCheckbox-root': {
					color: `${colors.greenAccent[200]} !important`,
				},
				'& .MuiDataGrid-toolbarContainer .MuiButton-text': {
					color: `${colors.blueAccent[200]} !important`,
				},
			}}
		>
			<Box height="100%" minWidth="600px">
				{children}
			</Box>
		</Box>
	);
}

export default DataGridWrapper;