import React, { createContext, useEffect, useState } from 'react';
import { axiosPrivate } from '../api/config';
import useAuthApi from '../api/auth';
import useLogout from '../hooks/useLogout';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import InfoToast from '../components/InfoToast';

export const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
	const { refreshToken } = useAuthApi();
	const logOut = useLogout();

	const updateAccessToken = (newToken) => {
		setToken({ access: newToken });
		localStorage.setItem('token', JSON.stringify({ access: newToken }));
	};

	const removeToken = () => {
		setToken(null);
	};

	const refreshTokenMutation = useMutation({
		mutationFn: refreshToken,
		onSuccess: (response) => {
			updateAccessToken(response.accessToken);
		},
		onError: (error) => {
			if (error.status === 429) {
				toast.custom(<InfoToast message={error?.response?.data?.message || error.message} />, {
					id: 'doubleRefresh',
				});
			} else if (error.status === 419 || error.status === 404) {
				toast.error(error?.response?.data?.message || error.message, { id: 'refresh-error' });
				removeToken(); //from state
				logOut('error');
			} else {
				toast.error(error?.response?.data?.message || error.message, { id: 'refresh-error' });
			}
		},
	}); // Hook to handle refreshing the token

	const [token, setToken] = useState(() => {
		const storedToken = localStorage.getItem('token');
		return storedToken ? JSON.parse(storedToken) : null; // Directly parse the token
	});

	useEffect(() => {
		if (token) {
			axiosPrivate.defaults.headers['Authorization'] = `Bearer ${token.access}`;
		} else {
			delete axiosPrivate.defaults.headers['Authorization'];
		}
	}, [token]);

	// Intercept responses to handle 401/403 errors
	useEffect(() => {
		const handleTokenRefresh = async (error) => {
			const originalRequest = error.config;
			if (!originalRequest._retry) {
				originalRequest._retry = true; // Prevent infinite loop on retry
				try {
					const refreshResponse = await refreshTokenMutation.mutateAsync(); // Call your refresh token function
					if (refreshResponse && refreshResponse.accessToken) {
						updateAccessToken(refreshResponse.accessToken);
						axiosPrivate.defaults.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`; // Update headers

						// Resend the original request with the new token
						originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
						return axiosPrivate(originalRequest); // Return the new request
					}
				} catch (err) {
					console.error('Failed to refresh:', err);
					return Promise.reject(err); // Reject if refresh fails
				}
			}
			return Promise.reject(error); // If already retried, reject the original error
		};

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			(error) => {
				const { response } = error;
				if (response && (response.status === 401 || response.status === 403)) {
					return handleTokenRefresh(error); // Handle token refresh logic
				}
				return Promise.reject(error); // Reject if it's not a 401/403
			}
		);

		return () => {
			axiosPrivate.interceptors.response.eject(responseIntercept); // Clean up interceptor
		};
	}, [token, refreshTokenMutation]);

	return (
		<AuthContext.Provider value={{ token, setToken, updateAccessToken, removeToken }}>
			{children}
		</AuthContext.Provider>
	);
};
