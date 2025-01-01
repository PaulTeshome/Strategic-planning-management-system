import {
	Box,
	Button,
	IconButton,
	ListItemButton,
	ListItemIcon,
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
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { FaDashcube } from 'react-icons/fa6';
import MyContext from '../../utils/MyContext';
import { Book, CalendarMonth, Chat, Logout, MenuOutlined, NextPlan, Notifications } from '@mui/icons-material';
import NavItem from '../NavItem';
import ConfirmationModal from '../modals/ConfirmationModal';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import { getDepartmentByRole } from '../../utils/getDepartmentByRole';

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
			requiredRole: ['vp'],
			element: (
				<Stack key="pres">
					<NavItem key="/vp/" title="Dashboard" to="/vp/" icon={<FaDashcube />} />
					<NavItem key="/vp/plan" title="Plan" to="/vp/plan" icon={<Book />} />
					<NavItem key="/vp/report" title="Report" to="/vp/report" icon={<BarChartOutlinedIcon />} />
					<NavItem key="/vp/schedule" title="Schedule" to="/vp/schedule" icon={<CalendarMonth />} />
					<NavItem key="/vp/generate-plan" title="Generate Plan" to="/vp/generate-plan" icon={<NextPlan />} />
				</Stack>
			),
		},
		{
			requiredRole: ['vpo', 'av', 'ado', 'rv'],
			element: (
				<Stack key="offi">
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
					p: 0,
				},
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				borderBottom={`1px solid ${colors.grey[700]}`}
				height={65}
				maxHeight={65}
				bgcolor={colors.grey[100]}
				width="100%"
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
							sx={{
								p: 0,
								margin: 0,
								'& .MuiSvgIcon-root': {
									color: colors.textBlue[500],
								},
							}}
						>
							<MenuOutlined />
						</Button>
					)}
					<Typography variant="h5" component="h1">
						{getDepartmentByRole(user.r_data)}
					</Typography>
					{matches && (
						<Menu
							sx={{
								'& .MuiPaper-root': { borderRadius: '5px', backgroundColor: colors.grey[200] },
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
								if (nav.requiredRole.includes(user.r_data) || nav.requiredRole.includes('none')) {
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

					<IconButton component={Link} to="/notifications">
						<Notifications />
					</IconButton>
					<IconButton component={Link} to="/profile">
						<PersonOutlinedIcon />
					</IconButton>
					<Typography variant="body1" color={colors.textBlue[500]} mx={1}>
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
