import { useTheme } from '@emotion/react';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { tokens } from '../theme';
import AASTULogo from '../assets/AASTU_Logo.svg';
import { Person } from '@mui/icons-material';
import PasswordComponent from '../components/form/PasswordComponent';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/yupSchemas';
import { Link, useNavigate } from 'react-router-dom';
import useAuthApi from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MyContext from '../utils/MyContext';

function LoginPage() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const navigate = useNavigate();

	const { loginUser } = useAuthApi();

	const { updateUser } = useContext(MyContext);

	const loginMutation = useMutation({
		mutationFn: loginUser,
		mutationKey: ['login'],
		onSuccess: (response) => {
			console.log('🚀 ~ ClinicLoginPage ~ response:', response);
			toast.success('Welcome!');

			const { id, email, role } = response.user;

			updateUser({ user_name: '', role_id: role, user_id: id });

			switch (role) {
				case 'vp':
					navigate('/vp');
					break;
				case 'spd':
					navigate('/strategic');

					break;
				// case '3':
				// 	navigate('/doctor');
				// 	break;
				default:
					navigate('/offices');
			}

			// queryClient.invalidateQueries({ queryKey: ['patients'] });
		},
		onError: (error) => {
			// console.log('🚀 ~ ClinicLoginPage ~ error:', error);

			if (error.response.status === 402) {
				navigate(`/verify/${error.response.data.package_id}`);
			} else if (error.response.status === 404) {
				toast.error('Incorrect Staff Id or password');
			} else {
				toast.error(error.response.data.message);
			}
		},
	});

	const handleLogin = (values) => {
		const { email, password } = values;
		const data = {
			email: email,
			password: password,
		};

		loginMutation.mutate(data);
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: handleLogin,
	});

	return (
		<Box
			width="100%"
			height="100vh"
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
				bgcolor={colors.grey[200]}
				boxShadow={5}
				direction="row"
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="65%"
				height="60%"
				borderRadius="5px"
				p={4}
				py={5}
				gap={1}
			>
				<Stack direction="column" display="flex" justifyContent="center" alignItems="center">
					<img src={AASTULogo} alt="Not Found" style={{ maxHeight: '150px', width: '40%', height: 'auto' }} />
					<Typography color={colors.aastuBlue[500]} variant="h4" component="h1" fontWeight="bold">
						Strategic Planning Management System
					</Typography>
				</Stack>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderRightWidth: 2, borderColor: colors.aastuBlue[500] }}
				/>
				<Stack
					direction="column"
					display="flex"
					justifyContent="center"
					alignItems="center"
					gap={2}
					p={1}
					width="50%"
					component="form"
					onSubmit={handleSubmit}
					// autoComplete="off"
					noValidate
				>
					<Stack direction="row" display="flex" justifyContent="center" alignItems="center" gap={2}>
						<Person />
						<Typography color={colors.aastuBlue[500]} variant="h4" component="h1" fontWeight="bold">
							Login
						</Typography>
					</Stack>
					<TextField
						name="email"
						label="Email"
						type="text"
						fullWidth
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.email && !!errors.email}
						helperText={touched.email && errors.email}
					/>

					<PasswordComponent
						name="password"
						label="Password"
						fullWidth
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.password && !!errors.password}
						helperText={touched.password && errors.password}
					/>

					<Button type="submit" variant="contained" color="primary" fullWidth size="large">
						Login
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default LoginPage;
