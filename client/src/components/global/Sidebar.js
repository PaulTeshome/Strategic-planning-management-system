import { Fragment, useContext, useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, Stack, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { FaDashcube } from 'react-icons/fa6';
import MyContext from '../../utils/MyContext';
import { Book, CalendarMonth, Chat, Logout, NextPlan, People } from '@mui/icons-material';
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
			requiredRole: ['vp'],
			element: (
				<Fragment key="pres">
					<NavItem key="/vp/" title="Dashboard" to="/vp/" icon={<FaDashcube />} />
					<NavItem key="/vp/plan" title="Plan" to="/vp/plan" icon={<Book />} />
					<NavItem key="/vp/report" title="Report" to="/vp/report" icon={<BarChartOutlinedIcon />} />
					<NavItem key="/vp/schedule" title="Schedule" to="/vp/schedule" icon={<CalendarMonth />} />
					<NavItem key="/vp/generate-plan" title="Create Plan" to="/vp/generate-plan" icon={<Chat />} />
				</Fragment>
			),
		},
		{
			requiredRole: ['spd'],
			element: (
				<Fragment key="strac">
					<NavItem key="/strategic/" title="Dashboard" to="/strategic/" icon={<FaDashcube />} />

					<NavItem key="/strategic/plan" title="Plan" to="/strategic/plan" icon={<Book />} />
					<NavItem
						key="/strategic/report"
						title="Report"
						to="/strategic/report"
						icon={<BarChartOutlinedIcon />}
					/>
					<NavItem
						key="/strategic/schedule"
						title="Schedule"
						to="/strategic/schedule"
						icon={<CalendarMonth />}
					/>
					{/* <NavItem
						key="/strategic/integrate-plan"
						title="Integrate Plan"
						to="/strategic/integrate-plan"
						icon={<NextPlan />}
					/>
					<NavItem
						key="/strategic/integrate-report"
						title="Integrate Report"
						to="/strategic/integrate-report"
						icon={<NextPlan />}
					/> */}
					<NavItem key="/strategic/users" title="Users" to="/strategic/users" icon={<People />} />
				</Fragment>
			),
		},
		{
			requiredRole: ['vpo', 'av', 'ado', 'rv'],
			element: (
				<Fragment key="pres">
					<NavItem key="/offices/" title="Dashboard" to="/offices/" icon={<FaDashcube />} />
					<NavItem key="/offices/plan" title="Plan" to="/offices/plan" icon={<Book />} />
					<NavItem
						key="/offices/report"
						title="Report"
						to="/offices/report"
						icon={<BarChartOutlinedIcon />}
					/>
					<NavItem key="/offices/schedule" title="Schedule" to="/offices/schedule" icon={<CalendarMonth />} />
					<NavItem key="/offices/feedback" title="Feedback" to="/offices/feedback" icon={<Chat />} />
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
				width: '17%',
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
				<Typography variant="h5" component="h1" fontWeight="bold" color={colors.aastuBlue[500]}>
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
				<Typography variant="h6" component="h2" color={colors.aastuBlue[500]} py={1}>
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
							color: colors.aastuBlue[500],
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

					<Typography variant="subtitle2" color={colors.aastuBlue[500]}>
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
