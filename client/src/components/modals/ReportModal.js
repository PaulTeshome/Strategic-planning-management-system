import { useTheme } from '@emotion/react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';
import CreateReportTable from '../tables/CreateReportTable';
import CloseIcon from '@mui/icons-material/Close';

function ReportModal({ open, onConfirm, onCancel, title, rows, setRows, year }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
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
			fullWidth
			fullScreen
			open={open}
			onClose={onCancel}
		>
			<DialogActions>
				<CloseIcon
					fontSize="large"
					sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
					onClick={() => {
						onCancel();
					}}
				/>
			</DialogActions>
			<DialogTitle sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.aastuBlue[500] }}>
				{title}
			</DialogTitle>
			<DialogContent>
				<CreateReportTable rows={rows} onCancel={onCancel} setRows={setRows} year={year} />
			</DialogContent>
		</Dialog>
	);
}

export default ReportModal;
