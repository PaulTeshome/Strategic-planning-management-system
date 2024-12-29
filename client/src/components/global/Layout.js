import { lazy, Suspense, useContext, useState } from 'react';
import { tokens } from '../../theme';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MyContext from '../../utils/MyContext';
import Sidebar from './Sidebar';
import { Box, Stack } from '@mui/material';
import Topbar from './Topbar';
import SkeletonLoader from '../SkeletonLoader';
import { useTheme } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import withAuth from '../../utils/withAuth';
import SmallLoader from '../SmallLoader';
import NotFound from '../../pages/NotFound';

const Login = lazy(() => import('../../pages/LoginPage'));

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
		case 'admin':
			dashboard = '/vp';
			break;
		case 'receptionist':
			dashboard = '/strategic';
			break;
		case 'doctor':
			dashboard = '/office';
			break;
		default:
			dashboard = '/login';
	}

	const appRoutes = [
		{
			element: (
				<Route
					key="/login-path"
					path="/login"
					element={
						<Suspense fallback={<SmallLoader />}>
							<Login />
						</Suspense>
					}
				/>
			),
			requiredRole: ['none'],
		},
	];

	return (
		<>
			{shouldRenderSidebar && <Sidebar isSidebar={isSidebar} />}
			<Stack component="main" direction="column" className="content">
				{shouldRenderSidebar && <Topbar setIsSidebar={setIsSidebar} />}
				<Box sx={{ height: 'fit-content', overflow: 'auto' }}>
					<Routes>
						{appRoutes.map((route) => {
							if (route.requiredRole.includes(user.r_data) || route.requiredRole.includes('none')) {
								return route.element;
							}
							return null;
						})}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Box>
				<Toaster
					position="top-center"
					reverseOrder={false}
					gutter={8}
					containerStyle={{}}
					toastOptions={{
						duration: 3000,
						style: {
							borderRadius: '20px',
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
								background: colors.redAccent[800],
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
