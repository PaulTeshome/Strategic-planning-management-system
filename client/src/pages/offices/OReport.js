import { Button, Grid2, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import SelectComponent from '../../components/form/SelectComponent';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { tokens } from '../../theme';
import { vpPlanSchema } from '../../utils/yupSchemas';
import { useFormik } from 'formik';
import ReportModal from '../../components/modals/ReportModal';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import usePlanApi from '../../api/plan';
import MyContext from '../../utils/MyContext';
import useReportApi from '../../api/report';

function OReport() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const date = new Date();
	const { user } = useContext(MyContext);
	const [rows, setRows] = useState([]);

	const handleSearch = () => {
		getPlanQuery.refetch();
	};

	const { values, errors, handleSubmit, handleBlur, handleChange, touched } = useFormik({
		initialValues: {
			year: date.getFullYear(),
			department: user.r_data,
			reportData: rows,
		},
		validationSchema: vpPlanSchema,
		onSubmit: handleSearch,
	});

	const { getRBy } = useReportApi();

	const [reportData, setReportData] = useState({});

	const getPlanQuery = useQuery({
		queryKey: ['report', values.year, values.department, 'approved'],
		queryFn: getRBy,
		staleTime: 1000 * 60 * 5,
		enabled: false,
		// retry: false,
	});

	useEffect(() => {
		if (getPlanQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPlanQuery.error:', getPlanQuery.error);
			toast.error(
				getPlanQuery.error?.response?.data?.message || getPlanQuery.error.message || 'Error getting plan',
				{
					id: 'getPlan',
				}
			);
		}
	}, [getPlanQuery.status, getPlanQuery.error]);

	useMemo(() => {
		if (getPlanQuery.status === 'success') {
			const planData = getPlanQuery.data?.data?.data[0]?.planData || [];
			console.log('🚀 ~ useMemo ~ planData: page lvl', planData);
			const repData = getPlanQuery.data?.data?.data[0];
			setReportData({ ...repData });

			setRows([...planData]);
		}
	}, [getPlanQuery.status, getPlanQuery.data]);

	const [openReport, setOpenReport] = useState(false);

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
				Insert Reports
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
						disabled={true}
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
					<Button type="submit" disabled={getPlanQuery.isLoading} fullWidth variant="contained" size="large">
						Search Plan
					</Button>
				</Grid2>
			</Grid2>
			{rows.map((plan, index) => (
				<Grid2
					key={index}
					size={{ xs: 12 }}
					display="flex"
					flexDirection="column"
					gap={1}
					maxHeight="fit-content"
				>
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						Report for {values.year}
					</Typography>
					<Button onClick={() => setOpenReport(true)} variant="outlined">
						Open Report for {values.year}
					</Button>
				</Grid2>
			))}

			{rows.length === 0 && getPlanQuery.isFetched && (
				<Grid2 size={{ xs: 12 }} display="flex" flexDirection="column" gap={1} maxHeight="fit-content">
					<Typography variant="h6" component="p" color={colors.textBlue[500]}>
						No approved reports found
					</Typography>
				</Grid2>
			)}

			<ReportModal
				rows={rows}
				reportData={reportData}
				title={`Report for ${values.year}`}
				open={openReport}
				onCancel={() => setOpenReport(false)}
				setRows={setRows}
				year={values.year}
			/>
		</Stack>
	);
}

export default OReport;
