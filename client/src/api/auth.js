import axios from './config';

const useAuthApi = () => {
	const loginUser = (data) => {
		return axios.post('/users/login', data, { withCredentials: true }).then((res) => res.data);
	};

	const logoutUser = (data) => {
		return axios.post('/users/logout', data, { withCredentials: true }).then((res) => res.data);
	};

	const registerUser = (data) => {
		return axios.post('/users/signup', data, { withCredentials: true }).then((res) => res.data);
	};
	// const refreshToken = (data) => {
	// 	return axios.post('/auth/refresh', data, { withCredentials: true }).then((res) => res.data);
	// };

	return { loginUser, logoutUser, registerUser };
};

export default useAuthApi;
