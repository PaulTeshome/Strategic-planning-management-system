import { useTheme } from '@emotion/react';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import SelectComponent from '../../components/form/SelectComponent';
import { useFormik } from 'formik';
import { vpReportSchema } from '../../utils/yupSchemas';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

function VPSchedule() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const date = new Date();

	const [scheduleDate, setScheduleDate] = useState(date);

	const handleSearch = () => {};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: '',
		},
		validationSchema: vpReportSchema,
		onSubmit: handleSearch,
	});

	return (
		<Grid2 container display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" gap={1}>
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
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
				noValidate
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
						{ value: 'all', label: 'All' },
						{ value: 'academics', label: 'Academics Office' },
						{ value: 'president', label: 'President Office' },
						{ value: 'research', label: 'Research Office' },
						{ value: 'administration', label: 'Administration Office' },
					]}
				/>
				<Button type="submit" fullWidth variant="contained" size="large">
					Search Schedule
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
				<StaticDatePicker readOnly defaultValue={dayjs(scheduleDate)} />
			</Grid2>
		</Grid2>
	);
}

export default VPSchedule;
