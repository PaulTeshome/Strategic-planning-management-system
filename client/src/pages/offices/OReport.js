import { Button, Grid2, Typography } from '@mui/material';
import React from 'react';
import SelectComponent from '../../components/form/SelectComponent';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';

function OReport() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [confirmOpen, setConfirmOpen] = useState(false);

	const closeConfirm = () => {
		setConfirmOpen(false);
	};
	const handleApprove = () => {
		console.log('🚀 ~ handleApprove ~ first:', values);
	};
	const handleSearch = () => {};

	const date = new Date();

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
		},
		validationSchema: vpPlanSchema,
		onSubmit: handleSearch,
	});

	return (
		<Stack
			direction="column"
			display="flex"
			justifyContent="space-between"
			bgcolor={colors.grey[100]}
			width="100%"
			minHeight={150}
			borderRadius="5px"
			boxShadow={5}
			p={2}
			px={5}
			gap={2}
		>
			<Typography variant="h5" component="p" fontWeight="bold">
				View Plans
			</Typography>
			<Grid2
				container
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				gap={1}
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				noValidate
			>
				<Grid2 size={{ xs: 3 }}>
					<TextField
						name="year"
						label="Year"
						type="number"
						fullWidth
						value={values.year}
						onChange={handleChange}
						onBlur={handleBlur}
						slotProps={{
							htmlInput: {
								min: 1,
							},
						}}
						error={touched.year && !!errors.year}
						helperText={touched.year && errors.year}
					/>
				</Grid2>
				<Grid2 size={{ xs: 4 }}>
					<SelectComponent
						required={true}
						touched={touched.department}
						error={errors.department}
						label="Department*"
						name="department"
						value={values.department}
						onChange={handleChange}
						onBlur={handleBlur}
						options={[
							{ value: 'all', label: 'All' },
							{ value: 'av', label: getDepartmentByRole('av') },
							{ value: 'vpo', label: getDepartmentByRole('vpo') },
							{ value: 'rv', label: getDepartmentByRole('rv') },
							{ value: 'ado', label: getDepartmentByRole('ado') },
						]}
					/>
				</Grid2>
				<Grid2 size={{ xs: 2 }} display="flex" maxHeight="fit-content">
					<Button type="submit" fullWidth variant="contained" size="large">
						Search Plan
					</Button>
				</Grid2>
				<Grid2 size={{ xs: 9 }} display="flex" maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Plan for {values.year}
					</Typography>
				</Grid2>
			</Grid2>
		</Stack>
	);
}

export default OReport;
