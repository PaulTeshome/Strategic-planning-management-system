import { useTheme } from '@emotion/react';
import { Grid2, Typography } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

function OFeedback() {
	const theme = useTheme();

	const colors = tokens(theme.palette.mode);
	return (
		<Grid2 container display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" gap={1}>
			<Grid2
				size={{ xs: 10 }}
				display="flex"
				alignItems="flex-start"
				justifyContent="felx-start"
				flexDirection="column"
				bgcolor={colors.grey[100]}
				minHeight={600}
				borderRadius="5px"
				boxShadow={5}
				p={4}
				gap={2}
			>
				<Typography variant="h5" component="p" fontWeight="bold">
					View Feedback
				</Typography>
			</Grid2>
		</Grid2>
	);
}

export default OFeedback;
