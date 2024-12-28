import { Box, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import NotFoundImg from '../assets/not_found.svg';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import MyContext from '../utils/MyContext';

function NotFound() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { updateTitle } = useContext(MyContext);

	useEffect(() => {
		updateTitle('Page Not Found');
	});

	return (
		<Box
			width="100%"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: 1,
				padding: '2rem',
				borderRadius: '8px',
			}}
		>
			<Stack
				bgcolor={colors.white}
				direction="column"
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="60%"
				borderRadius="20px"
				p={4}
			>
				<Typography color={colors.blueAccent[400]} variant="h3" component="h1" fontWeight="bold">
					Sorry! Page Not Found.
				</Typography>
				<img src={NotFoundImg} alt="Not Found" style={{ maxHeight: '450px', width: '100%', height: 'auto' }} />
			</Stack>
		</Box>
	);
}

export default NotFound;
