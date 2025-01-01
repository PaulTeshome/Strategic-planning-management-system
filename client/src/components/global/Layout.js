import { lazy, Suspense, useContext, useState } from 'react';
import { tokens } from '../../theme';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MyContext from '../../utils/MyContext';
import Sidebar from './Sidebar';
import { Box, Stack } from '@mui/material';
import Topbar from './Topbar';
import { useTheme } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
// import withAuth from '../../utils/withAuth';
import Loader from '../Loader';
import MainHolder from './MainHolder';

const Login = lazy(() => import('../../pages/LoginPage'));
const NotFound = lazy(() => import('../../pages/NotFound'));
const VPDashboard = lazy(() => import('../../pages/president/VPDashboard'));
const VPGenerate = lazy(() => import('../../pages/president/VPGenerate'));
const VPplan = lazy(() => import('../../pages/president/VPplan'));
const VPReport = lazy(() => import('../../pages/president/VPReport'));
const VPSchedule = lazy(() => import('../../pages/president/VPSchedule'));

function Layout() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isSidebar, setIsSidebar] = useState(true);
	const location = useLocation();
	const { user } = useContext(MyContext);

	// const navigate = useNavigate();

	const shouldRenderSidebar = !location.pathname.startsWith('/login');

	let dashboard = null;

	switch (user.r_data) {
		case 'vp':
			dashboard = '/vp';
			break;
		case 'spd':
			dashboard = '/strategic';
			break;
		case 'vpo':
			dashboard = '/office';
			break;
		case 'av':
			dashboard = '/office';
			break;
		case 'ado':
			dashboard = '/office';
			break;
		case 'rv':
			dashboard = '/office';
			break;
		default:
			dashboard = '/login';
	}

	const appRoutes = [
		{
			element: <Route key="/login-path" path="/login" element={<Login />} />,
			requiredRole: ['none'],
		},
		{
			element: <Route exact key="/redirect-path" path="/" element={<Navigate to={dashboard} />} />,
			requiredRole: ['none'],
		},
		{
			element: (
				<Route key="/president-path" path="/vp" element={<MainHolder />}>
					<Route index element={<VPDashboard />} />
					<Route path="plan" element={<VPplan />} />
					<Route path="plan/:plan_id" element={<VPplan />} />
					<Route path="report" element={<VPReport />} />
					<Route path="schedule" element={<VPSchedule />} />
					<Route path="generate-plan" element={<VPGenerate />} />
				</Route>
			),
			requiredRole: ['vp'],
		},
	];

	return (
		<>
			{shouldRenderSidebar && <Sidebar isSidebar={isSidebar} />}
			<Stack component="main" direction="column" className="content">
				{shouldRenderSidebar && <Topbar setIsSidebar={setIsSidebar} />}
				<Box sx={{ height: 'stretch', overflow: 'auto' }}>
					<Suspense fallback={<Loader />}>
						<Routes>
							{appRoutes.map((route) => {
								if (route.requiredRole.includes(user.r_data) || route.requiredRole.includes('none')) {
									return route.element;
								}
								return null;
							})}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Suspense>
				</Box>
				<Toaster
					position="top-center"
					reverseOrder={false}
					gutter={8}
					containerStyle={{}}
					toastOptions={{
						duration: 3000,
						style: {
							borderRadius: '5px',
							minWidth: '150px',
						},
						success: {
							style: {
								background: colors.greenAccent[800],
								color: colors.black,
							},
						},
						error: {
							style: {
								background: colors.redAccent[700],
								color: colors.black,
							},
						},
					}}
				/>
			</Stack>
		</>
	);
}

// export default withAuth(Layout);
export default Layout;
