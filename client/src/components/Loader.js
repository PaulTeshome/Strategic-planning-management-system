import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';
import AASTULogoCircle from '../assets/AASTU_Logo_circle.png';
import './Loader.css';

function Loader() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box display="flex" justifyContent="center" alignItems="center" width="100%" height="stretch">
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100px"
				height="100px"
				borderRadius={999}
				bgcolor={colors.grey[100]}
			>
				<img src={AASTULogoCircle} className="animated-logo" alt="AASTU logo" width="80px" height="80px" />
			</Box>
		</Box>
	);
}

export default Loader;
