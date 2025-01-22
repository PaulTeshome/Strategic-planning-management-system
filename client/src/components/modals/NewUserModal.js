import { useTheme } from '@emotion/react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2,
	InputAdornment,
	TextField,
} from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';
import CreateReportTable from '../tables/CreateReportTable';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { userAddSchema } from '../../utils/yupSchemas';
import useAuthApi from '../../api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SelectComponent from '../form/SelectComponent';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import PasswordComponent from '../form/PasswordComponent';

function NewUserModal({ open, onCancel, title }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { registerUser } = useAuthApi();
	const queryClient = useQueryClient();

	const createUserMutation = useMutation({
		mutationFn: registerUser,
		mutationKey: ['addUser'],
		onSuccess: (response) => {
			// console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success(response.status);
			queryClient.invalidateQueries({ queryKey: ['users'] });
			onCancel();
		},
		onError: (error) => {
			// console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handleCustomerAdd = (values) => {
		const { first_name, last_name, phone, role, email, password, confirm_password } = values;

		const data = {
			firstName: first_name,
			lastName: last_name,
			role: role,
			email: email,
			phone: parseInt(phone),
			password: password,
			passwordConfirm: confirm_password,
		};

		createUserMutation.mutate(data);
	};

	const customerFormik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			phone: '',
			email: '',
			role: '',
			password: '',
			confirm_password: '',
		},

		validationSchema: userAddSchema,
		onSubmit: handleCustomerAdd,
	});

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
				<Grid2
					container
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					py={2}
					gap={2}
					component="form"
					onSubmit={customerFormik.handleSubmit}
					autoComplete="off"
					noValidate
				>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<TextField
							fullWidth
							required
							variant="outlined"
							type="text"
							label="First Name"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.first_name}
							name="first_name"
							error={customerFormik.touched.first_name && Boolean(customerFormik.errors.first_name)}
							helperText={customerFormik.touched.first_name && customerFormik.errors.first_name}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<TextField
							fullWidth
							required
							variant="outlined"
							type="text"
							label="Last Name"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.last_name}
							name="last_name"
							error={customerFormik.touched.last_name && Boolean(customerFormik.errors.last_name)}
							helperText={customerFormik.touched.last_name && customerFormik.errors.last_name}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<TextField
							required
							fullWidth
							variant="outlined"
							type="text"
							label="Phone Number"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.phone}
							name="phone"
							error={customerFormik.touched.phone && Boolean(customerFormik.errors.phone)}
							helperText={customerFormik.touched.phone && customerFormik.errors.phone}
							InputProps={{
								startAdornment: <InputAdornment position="start">+251</InputAdornment>,
							}}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<TextField
							fullWidth
							variant="outlined"
							type="text"
							label="Email"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.email}
							name="email"
							error={customerFormik.touched.email && Boolean(customerFormik.errors.email)}
							helperText={customerFormik.touched.email && customerFormik.errors.email}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<SelectComponent
							required={true}
							touched={customerFormik.touched.role}
							error={customerFormik.errors.role}
							label="Role*"
							name="role"
							value={customerFormik.values.role}
							onChange={customerFormik.handleChange}
							onBlur={customerFormik.handleBlur}
							options={[
								{ value: 'av', label: getDepartmentByRole('av') },
								{ value: 'vpo', label: getDepartmentByRole('vpo') },
								{ value: 'rv', label: getDepartmentByRole('rv') },
								{ value: 'ado', label: getDepartmentByRole('ado') },
								{ value: 'vp', label: getDepartmentByRole('vp') },
							]}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<PasswordComponent
							fullWidth
							required={true}
							variant="outlined"
							type="text"
							label="Password"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.password}
							name="password"
							error={customerFormik.touched.password && Boolean(customerFormik.errors.password)}
							helperText={customerFormik.touched.password && customerFormik.errors.password}
						/>
					</Grid2>
					<Grid2 size={{ xs: 12, md: 5.8 }}>
						<PasswordComponent
							fullWidth
							required={true}
							variant="outlined"
							type="text"
							label="Confirm Password"
							onBlur={customerFormik.handleBlur}
							onChange={customerFormik.handleChange}
							value={customerFormik.values.confirm_password}
							name="confirm_password"
							error={
								customerFormik.touched.confirm_password &&
								Boolean(customerFormik.errors.confirm_password)
							}
							helperText={
								customerFormik.touched.confirm_password && customerFormik.errors.confirm_password
							}
						/>
					</Grid2>

					<Grid2 size={{ xs: 12 }} display="flex" justifyContent="flex-end">
						<Button type="submit" variant="contained">
							Add New User
						</Button>
					</Grid2>
				</Grid2>
			</DialogContent>
		</Dialog>
	);
}

export default NewUserModal;
