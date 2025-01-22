import React, { useState } from 'react';
import DataGridWrapper from '../../components/global/DataGridWrapper';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Stack, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomToolbar from '../../components/global/CustomToolbar';
import { Add } from '@mui/icons-material';
import NewUserModal from '../../components/modals/NewUserModal';

function SPusers() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [openNew, setOpenNew] = useState(false);

	const [rows, setRows] = useState([]);

	const columns = [
		{
			field: 'firstName',
			headerName: 'First Name',
			flex: 1,
		},
		{
			field: 'lastName',
			headerName: 'Last Name',
			flex: 1,
		},
		{
			field: 'email',
			headerName: 'Email',
			flex: 1,
		},
		{
			field: 'phoneNumber',
			headerName: 'Phone',
			flex: 1,
		},
		// {
		// 	field: 'submitted_by',
		// 	headerName: 'Submitted By',
		// 	flex: 1,
		// },
		// {
		// 	field: 'actions',
		// 	headerName: 'Actions',
		// 	disableExport: true,
		// 	flex: 1,
		// 	renderCell: (params) => (
		// 		<Stack direction="row" width="100%" height="100%" display="flex" alignItems="center">
		// 			<Button
		// 				component={Link}
		// 				variant="outlined"
		// 				size="small"
		// 				to={`/strategic/plan/${params.row.plan_id}`}
		// 			>
		// 				View
		// 			</Button>
		// 		</Stack>
		// 	),
		// },
	];

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%" gap={2}>
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
					View Users
				</Typography>
				<Stack direction="row" display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Button
						onClick={() => setOpenNew(true)}
						variant="text"
						startIcon={<Add sx={{ textDecorationColor: colors.aastuBlue[500] }} />}
					>
						Add New User
					</Button>
				</Stack>

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
				<NewUserModal open={openNew} onCancel={() => setOpenNew(false)} title="Add New User" />
			</Stack>
		</Box>
	);
}

export default SPusers;
