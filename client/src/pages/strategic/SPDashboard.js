import { useTheme } from '@emotion/react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { BarChartOutlined, Book } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DataGridWrapper from '../../components/global/DataGridWrapper';
import StatCard from '../../components/StatCard';
import CustomToolbar from '../../components/global/CustomToolbar';
import { Link } from 'react-router-dom';

function SPDashboard() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [rows, setRows] = useState([
		{
			plan_id: '2',
			plan_date: '12-12-2024',
			department: 'Academics',
			report_date: '12-12-2024',
			submitted_by: 'Abebe Bekele',
		},
		{
			plan_id: '3',
			plan_date: '12-12-2024',
			department: 'Academics',
			report_date: '12-12-2024',
			submitted_by: 'Abebe Bekele',
		},
		{
			plan_id: '1',
			plan_date: '12-12-2024',
			department: 'Academics',
			report_date: '12-12-2024',
			submitted_by: 'Abebe Bekele',
		},
		{
			plan_id: '4',
			plan_date: '12-12-2024',
			department: 'Academics',
			report_date: '12-12-2024',
			submitted_by: 'Abebe Bekele',
		},
		{
			plan_id: '5',
			plan_date: '12-12-2024',
			department: 'Academics',
			report_date: '12-12-2024',
			submitted_by: 'Abebe Bekele',
		},
	]);

	const columns = [
		{
			field: 'plan_id',
			headerName: 'Id',
		},
		{
			field: 'plan_date',
			headerName: 'Plan Date',
			flex: 1,
		},
		{
			field: 'department',
			headerName: 'Department',
			flex: 1,
		},
		{
			field: 'report_date',
			headerName: 'Report Date',
			flex: 1,
		},
		{
			field: 'submitted_by',
			headerName: 'Submitted By',
			flex: 1,
		},
		{
			field: 'actions',
			headerName: 'Actions',
			disableExport: true,
			flex: 1,
			renderCell: (params) => (
				<Stack direction="row" width="100%" height="100%" display="flex" alignItems="center">
					<Button component={Link} variant="outlined" size="small" to={`/strategic/plan/${params.row.plan_id}`}>
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
						getRowId={(row) => row.plan_id}
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

export default SPDashboard;
