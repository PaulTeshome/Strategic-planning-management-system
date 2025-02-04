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
import SPusers from '../../pages/strategic/SPusers';
import withAuth from '../../utils/withAuth';

const Login = lazy(() => import('../../pages/LoginPage'));
const NotFound = lazy(() => import('../../pages/NotFound'));
const ODashboard = lazy(() => import('../../pages/offices/ODashboard'));
const OPlan = lazy(() => import('../../pages/offices/OPlan'));
const OReport = lazy(() => import('../../pages/offices/OReport'));
const OSchedule = lazy(() => import('../../pages/offices/OSchedule'));
const OFeedback = lazy(() => import('../../pages/offices/OFeedback'));
const VPDashboard = lazy(() => import('../../pages/president/VPDashboard'));
const VPGenerate = lazy(() => import('../../pages/president/VPGenerate'));
const VPplan = lazy(() => import('../../pages/president/VPplan'));
const VPReport = lazy(() => import('../../pages/president/VPReport'));
const VPSchedule = lazy(() => import('../../pages/president/VPSchedule'));
const SPDashboard = lazy(() => import('../../pages/strategic/SPDashboard'));
const SPIntegratePlan = lazy(() => import('../../pages/strategic/SPIntegratePlan'));
const SPIntegrateReport = lazy(() => import('../../pages/strategic/SPIntegrateReport'));
const SPViewPlans = lazy(() => import('../../pages/strategic/SPViewPlans'));
const SPViewReport = lazy(() => import('../../pages/strategic/SPViewReport'));
const SPplan = lazy(() => import('../../pages/strategic/SPplan'));
const SPReport = lazy(() => import('../../pages/strategic/SPReport'));
const SPSchedule = lazy(() => import('../../pages/strategic/SPSchedule'));

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

	console.log('Current user role:', user.r_data);
	console.log('Navigating to:', dashboard);

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
				<Route key="/office-path" path="/offices" element={<MainHolder />}>
					<Route index element={<ODashboard />} />
					<Route path="plan" element={<OPlan />} />
					<Route path="plan/:plan_id" element={<OPlan />} />
					<Route path="report" element={<OReport />} />
					<Route path="schedule" element={<OSchedule />} />
					<Route path="feedback" element={<OFeedback />} />
				</Route>
			),
			requiredRole: ['vpo', 'av', 'ado', 'rv'],
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
		{
			element: (
				<Route key="/strategic-path" path="/strategic" element={<MainHolder />}>
					<Route index element={<SPDashboard />} />
					<Route path="users" element={<SPusers />} />
					<Route path="plan" element={<SPViewPlans />} />
					<Route path="plan/:plan_id" element={<SPplan />} />
					<Route path="report" element={<SPViewReport />} />
					<Route path="report/:report_id" element={<SPReport />} />
					<Route path="schedule" element={<SPSchedule />} />
					<Route path="integrate-plan" element={<SPIntegratePlan />} />
					<Route path="integrate-report" element={<SPIntegrateReport />} />
				</Route>
			),
			requiredRole: ['spd'],
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
								background: colors.greenAccent[400],
								color: colors.black,
							},
						},
						error: {
							style: {
								background: colors.redAccent[400],
								color: colors.white,
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
