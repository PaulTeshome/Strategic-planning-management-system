import { useTheme } from '@emotion/react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import { BarChartOutlined, Book } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DataGridWrapper from '../../components/global/DataGridWrapper';
import StatCard from '../../components/StatCard';
import CustomToolbar from '../../components/global/CustomToolbar';
import { Link, useParams } from 'react-router-dom';
import usePlanApi from '../../api/plan';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate';

function VPDashboard() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [rows, setRows] = useState([]);

	const { getAllPlans } = usePlanApi();

	const getPatientsQuery = useQuery({
		queryKey: ['plans'],
		queryFn: getAllPlans,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getPatientsQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getPatientsQuery.error:', getPatientsQuery.error);
			toast.error(
				getPatientsQuery.error?.response?.data?.message ||
					getPatientsQuery.error.message ||
					'Error getting plans'
			);
		}
	}, [getPatientsQuery.status, getPatientsQuery.error]);

	useMemo(() => {
		if (getPatientsQuery.status === 'success') {
			console.log('🚀 ~ useMemo ~ getPlans', getPatientsQuery.data.data);
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
				// console.log('🚀 ~ Patients ~ params:', params);
				return `${dob} G.C`; // Format the phone number as a string
			},
		},
		{
			field: 'department',
			headerName: 'Department',
			flex: 1,
		},
		{
			field: 'year',
			headerName: 'Year',
			flex: 1,
		},

		{
			field: 'actions',
			headerName: 'Actions',
			disableExport: true,
			flex: 1,
			renderCell: (params) => (
				<Stack direction="row" width="100%" height="100%" display="flex" alignItems="center">
					<Button component={Link} variant="outlined" size="small" to={`/vp/plan/${params.row._id}`}>
						View
					</Button>
				</Stack>
			),
		},
	];

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%" gap={2}>
			<Stack
				direction="row"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bgcolor={colors.grey[100]}
				width="100%"
				minHeight={150}
				borderRadius="5px"
				boxShadow={5}
				p={2}
				px={5}
				gap={2}
			>
				<StatCard
					icon={<Book sx={{ fontSize: '50px', color: colors.aastuGold[500] }} />}
					title="Total Plans"
					data="10"
				/>
				<Divider orientation="vertical" />
				<StatCard
					icon={<BarChartOutlined sx={{ fontSize: '50px', color: colors.aastuGold[500] }} />}
					title="Total Reports"
					data="10"
				/>
				<Divider orientation="vertical" />
				<StatCard
					icon={<Book sx={{ fontSize: '50px', color: colors.aastuGold[500] }} />}
					title="Total Plans"
					data="10"
				/>
			</Stack>
			<Stack
				direction="column"
				display="flex"
				bgcolor={colors.grey[100]}
				width="100%"
				height="fit-content"
				minHeight={430}
				borderRadius="5px"
				boxShadow={5}
				p={1}
				px={5}
				gap={1}
			>
				<Typography variant="h5" component="p" fontWeight="bold">
					View Plans
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

export default VPDashboard;
