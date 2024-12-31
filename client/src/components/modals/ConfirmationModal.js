import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

function ConfirmationModal({ open, onConfirm, onCancel, title, message, color }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Dialog
			PaperProps={{
				style: {
					paddingBlock: 20,
					paddingInline: 10,
					borderRadius: 5,
				},
			}}
			maxWidth={'sm'}
			fullWidth={true}
			// fullScreen={fullScreen}
			open={open}
			onClose={onCancel}
		>
			<DialogTitle sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.aastuBlue[500] }}>
				{title}
			</DialogTitle>
			<DialogContent>
				<p>{message}</p>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} variant="outlined" color="error">
					No
				</Button>
				<Button onClick={onConfirm} variant="contained" color="primary">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationModal;
