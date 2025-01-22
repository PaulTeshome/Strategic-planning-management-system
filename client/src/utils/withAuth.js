import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import InfoToast from '../components/InfoToast';

const withAuth = (Component) => {
	const AuthenticatedComponent = (props) => {
		const queryClient = useQueryClient();

		const navigate = useNavigate();

		const location = useLocation();

		useEffect(() => {
			const shouldAllow = location.pathname.startsWith('/login');
			if (!shouldAllow) {
				try {
					const storedUser = localStorage.getItem('user');

					if (!storedUser) {
						localStorage.removeItem('user');
						navigate('/login');
						toast.custom(<InfoToast message="Please log in!" />, {
							id: 'logout-info',
						});

						queryClient.removeQueries();
					}
				} catch (error) {
					localStorage.removeItem('user');

					navigate('/login');
					toast.error('Please log in to enter.');
					queryClient.removeQueries();

					console.log(error);
				}
			}
		}, [navigate, queryClient, location.pathname]);

		return <Component {...props} />;
	};

	return AuthenticatedComponent;
};

export default withAuth;
