import {
	Box,
	Button,
	Collapse,
	IconButton,
	ListItemButton,
	Menu,
	MenuItem,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useContext, useState } from 'react';
import { ColorModeContext, tokens } from '../../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
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
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

const Topbar = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);
	const matches = useMediaQuery(theme.breakpoints.down('md'));
	const { user } = useContext(MyContext);
	const logOut = useLogout();

	const [anchorEl, setAnchorEl] = useState(null);
	const [openLogout, setOpenLogout] = useState(false);

	const closeLogout = () => {
		setOpenLogout(false);
	};

	const confirmLogout = () => {
		closeLogout();
		logOut();
	};

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const navElements = [
		{
			requiredRole: ['admin'],
			element: (
				<Stack direction="column" p={0} key="ad">
					<NavItem key="/admin/" title="Dashboard" to="/admin/" icon={<FaDashcube />} />
					<NavItem key="/admin/doctors" title="Doctors" to="/admin/doctors" icon={<FaUserDoctor />} />
					<NavItem
						key="/admin/receptionists"
						title="Receptionsts"
						to="/admin/receptionists"
						icon={<ContactsOutlinedIcon />}
					/>
					<NavItem
						key="/admin/statistics"
						title="Statistics"
						to="/admin/statistics"
						icon={<BarChartOutlinedIcon />}
					/>
					<NavItem key="/admin/settings" title="Settings" to="/admin/settings" icon={<Settings />} />
				</Stack>
			),
		},

		{
			requiredRole: ['receptionist'],
			element: (
				<Stack direction="column" p={0} key="re">
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
				</Stack>
			),
		},
		{
			requiredRole: ['doctor'],
			element: (
				<Stack direction="column" p={0} key="do">
					<NavItem key="/doctor" title="Dashboard" to="/doctor" icon={<FaDashcube />} />
					<NavItem key="/doctor/patients" title="Patient Room" to="/doctor/patients" icon={<People />} />
					<NavItem key="/doctor/schedule" title="Scheduling" to="/doctor/schedule" icon={<CalendarMonth />} />
				</Stack>
			),
		},
	];

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			width="100%"
			zIndex={150}
			sx={{
				[theme.breakpoints.up('xs')]: {
					position: 'sticky',
					top: 0,
					px: 1,
				},
				[theme.breakpoints.up('md')]: {
					position: '',
					pr: 2,
				},
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				borderRadius="20px"
				bgcolor={colors.white}
				width="100%"
				my={1}
				p={2}
				px={matches ? 1 : 3}
			>
				<Stack direction="row" display="flex" justifyContent="space-between" alignItems="center" gap={1}>
					{matches && (
						<Button
							id="basic-button"
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
							sx={{ p: 0, margin: 0 }}
						>
							<MenuOutlined />
						</Button>
					)}

					{matches && (
						<Menu
							sx={{
								'& .MuiPaper-root': { borderRadius: '30px', backgroundColor: colors.white },
								p: 0,
							}}
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							{navElements.map((nav, index) => {
								if (nav.requiredRole.includes(user.r_data)) {
									return (
										<MenuItem sx={{ p: 0.5 }} key={index} onClick={handleClose}>
											{nav.element}
										</MenuItem>
									);
								}
								return null;
							})}
							<MenuItem key="logout" onClick={handleClose}>
								<ListItemButton
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										p: 1,

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
									<Logout />

									<Collapse in={true}>
										<Typography variant="caption" color={colors.black}>
											Logout
										</Typography>
									</Collapse>
								</ListItemButton>
							</MenuItem>
						</Menu>
					)}
					<Typography
						variant={matches ? 'h6' : 'h5'}
						component="h1"
						fontWeight="bold"
						fontFamily="Philosopher"
					></Typography>
				</Stack>

				<Box display="flex" alignItems="center" gap={0.1}>
					<IconButton onClick={colorMode.toggleColorMode}>
						{theme.palette.mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
					</IconButton>

					<IconButton component={Link} to="/profile">
						<PersonOutlinedIcon />
					</IconButton>
					<Typography variant="body1" color={colors.blueAccent[200]} mx={1}>
						{user.user_name}
					</Typography>
				</Box>
			</Box>
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

export default Topbar;
