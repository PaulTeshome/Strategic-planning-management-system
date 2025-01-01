import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

function DataGridWrapper({ children }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			borderRadius="5px"
			bgcolor={colors.grey[200]}
			p={{ xs: 1, md: 2 }}
			// height="75vh"
			height="stretch"
			width="100%"
			sx={{
				overflowX: 'auto',
				'& .MuiDataGrid-root': {
					border: 'none',
				},
				'& .MuiDataGrid-columnHeader': {
					backgroundColor: colors.aastuBlue[500],
					color: colors.grey[400],

					'& .MuiSvgIcon-root': {
						color: `${colors.grey[100]} !important`,
					},
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
					backgroundColor: colors.grey[400],
				},

				'& .MuiCheckbox-root': {
					color: `${colors.greenAccent[200]} !important`,
				},
				'& .MuiDataGrid-toolbarContainer .MuiButton-text': {
					color: `${colors.aastuBlue[500]} !important`,
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
