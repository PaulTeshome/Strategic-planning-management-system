import { useTheme } from '@emotion/react';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { tokens } from '../../theme';
import SelectComponent from '../../components/form/SelectComponent';
import { useFormik } from 'formik';
import { vpReportSchema } from '../../utils/yupSchemas';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { QueryClient, useMutation } from '@tanstack/react-query';
import useReportApi from '../../api/report';
import toast from 'react-hot-toast';
import MyContext from '../../utils/MyContext';
import { DatePicker } from '@mui/x-date-pickers';

function SPSchedule() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { user } = useContext(MyContext);
	const date = new Date();

	const [scheduleDate, setScheduleDate] = useState(date);
	const queryClient = new QueryClient();

	const { updateReport } = useReportApi();

	const updatePlanMut = useMutation({
		mutationFn: updateReport,
		mutationKey: ['updateReport'],
		onSuccess: (response) => {
			// // console.log('🚀 ~ AddNewPatient ~ response:', response);
			toast.success('Update ' + response.status);
			queryClient.invalidateQueries({ queryKey: ['report'] });
		},
		onError: (error) => {
			// // console.log('🚀 ~ AddNewPatient ~ error:', error);

			toast.error(error.response.data.message || error.response.statusText);
		},
	});

	const handlePlanUpdate = (values) => {
		const { quarter } = values;
		let query = '';

		switch (quarter) {
			case '1':
				query = 'quarter_1_due_date';
				break;
			case '2':
				query = 'quarter_2_due_date';
				break;
			case '3':
				query = 'quarter_3_due_date';
				break;
			case '4':
				query = 'quarter_4_due_date';
				break;
			default:
				query = 'quarter_1_due_date';
				break;
		}
		const data = {
			year: values.year,
			department: user.r_data,
			[query]: values.schedule,
		};
		console.log('🚀 ~ handlePlanUpdate ~ data:', data);

		// updatePlanMut.mutate(data);
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched, setFieldValue } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
			quarter: '',
			schedule: dayjs(null),
		},
		validationSchema: vpReportSchema,
		onSubmit: handlePlanUpdate,
	});

	return (
		<Grid2
			component="form"
			onSubmit={handleSubmit}
			autoComplete="off"
			noValidate
			container
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			height="100%"
			gap={1}
		>
			<Grid2
				size={{ xs: 12, md: 5 }}
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
				bgcolor={colors.grey[100]}
				minHeight={300}
				borderRadius="5px"
				boxShadow={5}
				p={4}
				gap={2}
			>
				<Typography variant="h5" component="p" fontWeight="bold">
					View Scheduled Report Dates
				</Typography>
				<TextField
					name="year"
					label="Year"
					type="number"
					fullWidth
					disabled
					value={values.year}
					onChange={handleChange}
					onBlur={handleBlur}
					slotProps={{
						htmlInput: {
							min: date.getFullYear(),
						},
					}}
					error={touched.year && !!errors.year}
					helperText={touched.year && errors.year}
				/>

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
						// { value: 'all', label: 'All' },
						{ value: 'av', label: getDepartmentByRole('av') },
						{ value: 'vpo', label: getDepartmentByRole('vpo') },
						{ value: 'rv', label: getDepartmentByRole('rv') },
						{ value: 'ado', label: getDepartmentByRole('ado') },
					]}
				/>
				<SelectComponent
					required={true}
					touched={touched.quarter}
					error={errors.quarter}
					label="Quarter*"
					name="quarter"
					value={values.quarter}
					onChange={handleChange}
					onBlur={handleBlur}
					options={[
						// { value: 'all', label: 'All' },
						{ value: '1', label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
					]}
				/>
				<Button
					type="submit"
					onClick={() => {
						console.log(errors);
					}}
					fullWidth
					variant="contained"
					size="large"
				>
					Set Schedule
				</Button>
			</Grid2>
			<Grid2
				size={{ xs: 12, md: 5 }}
				display="flex"
				flexDirection="column"
				bgcolor={colors.grey[100]}
				minHeight={250}
				borderRadius="5px"
				boxShadow={5}
				p={4}
				gap={2}
			>
				<DatePicker
					required
					defaultValue={dayjs(scheduleDate)}
					name="schedule"
					disablePast={true}
					views={['year', 'month', 'day']}
					variant="outlined"
					format="DD/MM/YYYY"
					label="Date of Birth"
					onBlur={handleBlur}
					onChange={(date) => setFieldValue('schedule', date)}
					value={values.schedule}
					slotProps={{
						textField: {
							helperText: touched.schedule && errors.schedule ? errors.schedule : '',
							error: touched.schedule && Boolean(errors.schedule) ? true : false,
							fullWidth: true,
						},
					}}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Grid2>
		</Grid2>
	);
}

export default SPSchedule;
