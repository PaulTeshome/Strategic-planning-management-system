import axios from './config';

const useAuthApi = () => {
	const loginUser = (data) => {
		return axios.post('/auth/login', data, { withCredentials: true }).then((res) => res.data);
	};

	const logoutUser = (data) => {
		return axios.post('/auth/logout', data, { withCredentials: true }).then((res) => res.data);
	};
	const refreshToken = (data) => {
		return axios.post('/auth/refresh', data, { withCredentials: true }).then((res) => res.data);
	};

	return { loginUser, logoutUser, refreshToken };
};

export default useAuthApi;
