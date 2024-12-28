import { Fragment, useContext, useState } from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { FaDashcube, FaUserDoctor } from 'react-icons/fa6';
import MyContext from '../../utils/MyContext';
import {
	CalendarMonth,
	Logout,
	MenuOutlined,
	Money,
	People,
	PersonAdd,
	PersonSearch,
	Settings,
} from '@mui/icons-material';
import NavItem from '../NavItem';
import ConfirmationModal from '../modals/ConfirmationModal';
import useLogout from '../../hooks/useLogout';

const Sidebar = () => {
	const theme = useTheme();

	const colors = tokens(theme.palette.mode);
	const { user } = useContext(MyContext);
	const logOut = useLogout();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [openLogout, setOpenLogout] = useState(false);

	const closeLogout = () => {
		setOpenLogout(false);
	};

	const confirmLogout = () => {
		closeLogout();
		logOut();
	};

	const navElements = [
		{
			requiredRole: ['admin'],
			element: (
				<Fragment key="ad">
					<NavItem
						isCollapsed={isCollapsed}
						key="/admin/"
						title="Dashboard"
						to="/admin/"
						icon={<FaDashcube />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/admin/doctors"
						title="Doctors"
						to="/admin/doctors"
						icon={<FaUserDoctor />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/admin/receptionists"
						title="Receptionsts"
						to="/admin/receptionists"
						icon={<ContactsOutlinedIcon />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/admin/statistics"
						title="Statistics"
						to="/admin/statistics"
						icon={<BarChartOutlinedIcon />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/admin/settings"
						title="Settings"
						to="/admin/settings"
						icon={<Settings />}
					/>
				</Fragment>
			),
		},

		{
			requiredRole: ['receptionist'],
			element: (
				<Fragment key="re">
					<NavItem
						isCollapsed={isCollapsed}
						key="/reception"
						title="Dashboard"
						to="/reception"
						icon={<FaDashcube />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/reception/patients"
						title="Patients"
						to="/reception/patients"
						icon={<PersonSearch />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/reception/add-patient"
						title="Add Patient"
						to="/reception/add-patient"
						icon={<PersonAdd />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/reception/queue"
						title="Queuing"
						to="/reception/queue"
						icon={<People />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/reception/payment"
						title="Payment"
						to="/reception/payment"
						icon={<Money />}
					/>
				</Fragment>
			),
		},
		{
			requiredRole: ['doctor'],
			element: (
				<Fragment key="do">
					<NavItem
						isCollapsed={isCollapsed}
						key="/doctor"
						title="Dashboard"
						to="/doctor"
						icon={<FaDashcube />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/doctor/patients"
						title="Patient Room"
						to="/doctor/patients"
						icon={<People />}
					/>
					<NavItem
						isCollapsed={isCollapsed}
						key="/doctor/schedule"
						title="Scheduling"
						to="/doctor/schedule"
						icon={<CalendarMonth />}
					/>
				</Fragment>
			),
		},
	];

	return (
		<Box
			pt={1}
			sx={{
				px: 3,
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				'& .Mui-selected': {
					backgroundColor: 'transparent',
				},
				[theme.breakpoints.up('xs')]: {
					display: 'none',
				},
				[theme.breakpoints.up('md')]: {
					display: 'block',
				},
			}}
		>
			<List
				component="nav"
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
					p: 0,
				}}
			>
				<Box
					bgcolor={colors.white}
					component="button"
					onClick={() => {
						setIsCollapsed(!isCollapsed);
					}}
					borderRadius={6}
					p={3}
					mx={0.5}
					display="flex"
					flexDirection="column"
					alignItems="center"
				>
					<MenuOutlined />
				</Box>
				<Box
					bgcolor={colors.white}
					borderRadius={10}
					display="flex"
					sx={{
						flexDirection: 'column',
						py: 3,
						my: 3,
					}}
				>
					{navElements.map((nav) => {
						if (nav.requiredRole.includes(user.r_data)) {
							return nav.element;
						}
						return null;
					})}

					<ListItemButton
						key="logout-link"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',

							'& .MuiListItemIcon-root': {
								color: colors.black,
							},
							[theme.breakpoints.up('xs')]: {
								'& .MuiListItemIcon-root': {
									fontSize: '12px',
								},
							},
							[theme.breakpoints.up('md')]: {
								'& .MuiListItemIcon-root': {
									fontSize: '18px',
								},
							},
						}}
						onClick={() => {
							setOpenLogout(true);
						}}
					>
						<ListItemIcon>
							<Logout />
						</ListItemIcon>
						<Collapse in={!isCollapsed}>
							<Typography variant="caption" color={colors.black}>
								Logout
							</Typography>
						</Collapse>
					</ListItemButton>
				</Box>
			</List>
			<ConfirmationModal
				open={openLogout}
				onCancel={closeLogout}
				onConfirm={confirmLogout}
				title="Logging out"
				message="Are you sure you want to log out?"
			/>
		</Box>
	);
};

export default Sidebar;
