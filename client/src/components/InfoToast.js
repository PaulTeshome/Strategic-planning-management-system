import { useTheme } from '@emotion/react';
import { Warning } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';

function InfoToast({ message }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Stack
			direction="row"
			display="flex"
			alignItems="center"
			justifyContent="flex-start"
			gap={1}
			p={1.3}
			borderRadius="5px"
			minWidth="150px"
			bgcolor={colors.primary[200]}
			color={colors.black}
		>
			<Warning sx={{ color: colors.primary[400] }} />
			<Typography color={colors.black} justifySelf="center">
				{message}
			</Typography>
		</Stack>
	);
}

export default InfoToast;
