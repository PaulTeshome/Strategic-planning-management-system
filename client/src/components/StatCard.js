import { Stack, Typography } from '@mui/material';
import React from 'react';

function StatCard({ icon, title, data }) {
	return (
		<Stack direction="row" gap={1}>
			{icon}
			<Stack direction="column">
				<Typography variant="h3" component="p" fontWeight="bold">
					{title}
				</Typography>
				<Typography variant="h6" component="p">
					{data}
				</Typography>
			</Stack>
		</Stack>
	);
}

export default StatCard;
