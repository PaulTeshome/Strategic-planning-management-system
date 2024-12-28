import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';
import { useFormik } from 'formik';
import { changePsdSchema } from '../../utils/yupSchemas';

function ChangePasswordModal({ open, onCancel }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const handleChangeSubmit = () => {};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			old_password: '',
			new_password: '',
			confirm_password: '',
		},
		validationSchema: changePsdSchema,
		onSubmit: handleChangeSubmit,
	});

	return (
		<Dialog
			PaperProps={{
				style: {
					paddingBlock: 20,
					paddingInline: 10,
					borderRadius: 20,
				},
				component: 'form',
				onSubmit: handleSubmit,
			}}
			maxWidth={'sm'}
			fullWidth={true}
			open={open}
			onClose={onCancel}
		>
			<DialogTitle sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.blueAccent[200] }}>
				Change your password
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					borderRadius="20px"
					bgcolor={colors.white}
					p={4}
					my={2}
					minHeight={300}
					width="100%"
					justifyContent="space-between"
					gap={2}
				>
					<Grid item xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							type="text"
							label="Old Password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.old_password}
							name="old_password"
							error={touched.old_password && Boolean(errors.old_password)}
							helperText={touched.old_password && errors.old_password}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							type="text"
							label="New Password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.new_password}
							name="new_password"
							error={touched.new_password && Boolean(errors.new_password)}
							helperText={touched.new_password && errors.new_password}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							variant="outlined"
							type="text"
							label="Confirm Password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.confirm_password}
							name="confirm_password"
							error={touched.confirm_password && Boolean(errors.confirm_password)}
							helperText={touched.confirm_password && errors.confirm_password}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} variant="outlined" color="error">
					Cancel
				</Button>
				<Button type="submit" variant="contained" color="primary">
					Change
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ChangePasswordModal;
