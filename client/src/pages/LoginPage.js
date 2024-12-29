import { useTheme } from '@emotion/react';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';
import AASTULogo from '../assets/AASTU_Logo.svg';
import { Person } from '@mui/icons-material';
import PasswordComponent from '../components/form/PasswordComponent';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/yupSchemas';

function LoginPage() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const handleLogin = () => {};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			username: '',
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
					autoComplete="off"
					noValidate
				>
					<Stack direction="row" display="flex" justifyContent="center" alignItems="center" gap={2}>
						<Person />
						<Typography color={colors.aastuBlue[500]} variant="h4" component="h1" fontWeight="bold">
							Login
						</Typography>
					</Stack>
					<TextField
						name="username"
						label="Username"
						type="text"
						fullWidth
						value={values.username}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.username && !!errors.username}
						helperText={touched.username && errors.username}
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
