import { Fragment, useContext, useState } from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, Stack, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { FaDashcube, FaUserDoctor } from 'react-icons/fa6';
import MyContext from '../../utils/MyContext';
import {
	Book,
	CalendarMonth,
	ChatRounded,
	Logout,
	MenuOutlined,
	Money,
	NextPlan,
	People,
	PersonAdd,
	PersonSearch,
	Settings,
} from '@mui/icons-material';
import NavItem from '../NavItem';
import ConfirmationModal from '../modals/ConfirmationModal';
import useLogout from '../../hooks/useLogout';
import AASTULogoCircle from '../../assets/AASTU_Logo_circle.png';

const Sidebar = () => {
	const theme = useTheme();

	const colors = tokens(theme.palette.mode);
	const { user } = useContext(MyContext);
	const logOut = useLogout();

	// const [isCollapsed, setIsCollapsed] = useState(false);
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
			requiredRole: ['none'],
			element: (
				<Fragment key="pres">
					<NavItem key="/admin/" title="Dashboard" to="/admin/" icon={<FaDashcube />} />
					<NavItem key="/admin/plan" title="Plan" to="/admin/plan" icon={<Book />} />
					<NavItem key="/admin/report" title="Report" to="/admin/report" icon={<BarChartOutlinedIcon />} />
					<NavItem key="/admin/schedule" title="Schedule" to="/admin/schedule" icon={<CalendarMonth />} />
					<NavItem
						key="/admin/generate-plan"
						title="Generate Plan"
						to="/admin/generate-plan"
						icon={<NextPlan />}
					/>
				</Fragment>
			),
		},

		{
			requiredRole: ['receptionist'],
			element: (
				<Fragment key="re">
					<NavItem key="/reception" title="Dashboard" to="/reception" icon={<FaDashcube />} />
					<NavItem
						key="/reception/patients"
						title="Patients"
						to="/reception/patients"
						icon={<PersonSearch />}
					/>
					<NavItem
						key="/reception/add-patient"
						title="Add Patient"
						to="/reception/add-patient"
						icon={<PersonAdd />}
					/>
					<NavItem key="/reception/queue" title="Queuing" to="/reception/queue" icon={<People />} />
					<NavItem key="/reception/payment" title="Payment" to="/reception/payment" icon={<Money />} />
				</Fragment>
			),
		},
		{
			requiredRole: ['doctor'],
			element: (
				<Fragment key="do">
					<NavItem key="/doctor" title="Dashboard" to="/doctor" icon={<FaDashcube />} />
					<NavItem key="/doctor/patients" title="Patient Room" to="/doctor/patients" icon={<People />} />
					<NavItem key="/doctor/schedule" title="Scheduling" to="/doctor/schedule" icon={<CalendarMonth />} />
				</Fragment>
			),
		},
	];

	return (
		<Box
			sx={{
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				width: '16.67%',
				backgroundColor: colors.grey[200],
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
			<Stack
				direction="row"
				alignItems="center"
				px={2}
				py={0}
				width="100%"
				gap={2}
				borderBottom={`1px solid ${colors.grey[700]}`}
				height={65}
				maxHeight={65}
			>
				<img src={AASTULogoCircle} alt="aastu logo" width="30px" height="30px" />
				<Typography variant="h5" component="h1" fontWeight="bold" color={colors.textBlue[500]}>
					SPMS
				</Typography>
			</Stack>
			<List
				component="nav"
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					p: 0,
					px: 2,
					gap: 0.5,
				}}
			>
				<Typography variant="h6" component="h2" color={colors.textBlue[500]} py={1}>
					Menu
				</Typography>
				{navElements.map((nav) => {
					if (nav.requiredRole.includes(user.r_data) || nav.requiredRole.includes('none')) {
						return nav.element;
					}
					return null;
				})}

				<ListItemButton
					key="logout-link"
					sx={{
						display: 'flex',
						flexDirection: 'row',
						position: 'relative',
						bottom: 0,
						alignItems: 'flex-start',
						justifyContent: 'left',
						width: '100%',
						borderRadius: '5px',
						gap: 2,
						p: 2,
						'& .MuiListItemIcon-root': {
							color: colors.textBlue[500],
						},

						[theme.breakpoints.down('md')]: {
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

					<Typography variant="subtitle2" color={colors.textBlue[500]}>
						Logout
					</Typography>
				</ListItemButton>
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
