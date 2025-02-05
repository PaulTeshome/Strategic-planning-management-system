import { useTheme } from '@emotion/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import DataGridWrapper from '../../components/global/DataGridWrapper';
import CustomToolbar from '../../components/global/CustomToolbar';
import { Link } from 'react-router-dom';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import useReportApi from '../../api/report';

function SPViewReport() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [rows, setRows] = useState([]);

	const { getRBy } = useReportApi();

	const getPatientsQuery = useQuery({
		queryKey: ['reports', null, null, 'submitted'],
		queryFn: getRBy,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getPatientsQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPatientsQuery.error:', getPatientsQuery.error);
			toast.error(
				getPatientsQuery.error?.response?.data?.message ||
					getPatientsQuery.error.message ||
					'Error getting reports'
			);
		}
	}, [getPatientsQuery.status, getPatientsQuery.error]);

	useMemo(() => {
		if (getPatientsQuery.status === 'success') {
			console.log('🚀 ~ useMemo ~ getreports', getPatientsQuery.data.data);
			const patientList = getPatientsQuery.data?.data?.data;
			setRows([...patientList]);
		}
	}, [getPatientsQuery.status, getPatientsQuery.data]);

	const columns = [
		{
			field: 'createdAt',
			headerName: 'Created At',
			flex: 1,
			valueFormatter: (params) => {
				const dob = formatDate(params);
				return `${dob} G.C`;
			},
		},
		{
			field: 'department',
			headerName: 'Department',
			flex: 1,
			valueFormatter: (params) => {
				const deptName = getDepartmentByRole(params);
				return deptName;
			},
		},
		{
			field: 'year',
			headerName: 'Year',
			flex: 1,
		},
		{
			field: 'status',
			headerName: 'Status',
			flex: 1,
		},
		{
			field: 'actions',
			headerName: 'Actions',
			disableExport: true,
			flex: 1,
			renderCell: (params) => (
				<Stack direction="row" width="100%" height="100%" display="flex" alignItems="center">
					<Button component={Link} variant="outlined" size="small" to={`/strategic/report/${params.row._id}`}>
						View
					</Button>
				</Stack>
			),
		},
	];
	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%" gap={2}>
			<Stack
				direction="column"
				display="flex"
				bgcolor={colors.grey[100]}
				width="100%"
				height="fit-content"
				minHeight={630}
				borderRadius="5px"
				boxShadow={5}
				p={1}
				px={5}
				gap={1}
			>
				<Typography variant="h5" component="p" fontWeight="bold">
					View reports
				</Typography>
				<DataGridWrapper>
					<DataGrid
						getRowId={(row) => row._id}
						rows={rows}
						columns={columns}
						slots={{ toolbar: CustomToolbar }}
						initialState={{
							pagination: { pageSize: 10 },
						}}
						rowsPerPageOptions={[10, 25, 50]}
						slotProps={{
							toolbar: {
								showQuickFilter: true,
							},
						}}
					/>
				</DataGridWrapper>
			</Stack>
		</Box>
	);
}

export default SPViewReport;
