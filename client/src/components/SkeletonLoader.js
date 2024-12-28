import { useTheme } from '@emotion/react';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { tokens } from '../theme';
import { useMediaQuery } from '@mui/material';

function SkeletonLoader() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const matches = useMediaQuery(theme.breakpoints.down('md'));
	return (
		<ContentLoader
			speed={2}
			width="100%"
			height="100vh"
			style={{ padding: '10px' }}
			spacing={10}
			backgroundColor={colors.grey[800]}
			foregroundColor={colors.grey[300]}
			opacity={0.6}
		>
			<rect x="0" y="0" rx="20" ry="20" width="100%" height={matches ? '200px' : '270px'} />
			<rect x="0" y={matches ? '220' : '300'} rx="20" ry="20" width="49%" height="370" />
			<rect x="51%" y={matches ? '220' : '300'} rx="20" ry="20" width="49%" height="370" />
		</ContentLoader>
	);
}

export default SkeletonLoader;
