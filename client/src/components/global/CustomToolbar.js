import { GridToolbar, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React from 'react';

function CustomToolbar({ width = 400 }) {
	return (
		<GridToolbarContainer
			sx={{
				justifyContent: 'space-between',
			}}
		>
			<GridToolbar />
			<GridToolbarQuickFilter sx={{ width: width }} />
		</GridToolbarContainer>
	);
}

export default CustomToolbar;
