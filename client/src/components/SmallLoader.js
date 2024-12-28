import React from 'react';
import { useTheme } from '@emotion/react';
import ContentLoader from 'react-content-loader';
import { tokens } from '../theme';
import { useMediaQuery } from '@mui/material';

function SmallLoader() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const matches = useMediaQuery(theme.breakpoints.down('md'));
	return (
		<ContentLoader
			speed={2}
			width="100%"
			height="100vh"
			style={{
				gap: '10px',
				padding: '10px',
			}}
			backgroundColor={colors.grey[800]}
			foregroundColor={colors.grey[300]}
			opacity={0.6}
		>
			<rect
				x={matches ? '3%' : '32%'}
				y={matches ? '7%' : '8%'}
				rx="20"
				ry="20"
				width={matches ? '94%' : '36%'}
				height="465px"
			/>
		</ContentLoader>
	);
}

export default SmallLoader;
