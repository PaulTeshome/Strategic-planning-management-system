import axios from './config';

const useAuthApi = () => {
	const loginUser = (data) => {
		return axios.post('/users/login', data, { withCredentials: true }).then((res) => res.data);
	};

	const logoutUser = (data) => {
		return axios.get('/users/logout', { withCredentials: true }).then((res) => res.data);
	};

	const registerUser = (data) => {
		return axios.post('/users/signup', data, { withCredentials: true }).then((res) => res.data);
	};

	const getAllUsers = (data) => {
		return axios.get('/users/', { withCredentials: true }).then((res) => res.data);
	};
	const getUser = ({ queryKey }) => {
		const [, user_id] = queryKey;
		return axios.get(`/users/${user_id}`, { withCredentials: true }).then((res) => res.data);
	};
	// const refreshToken = (data) => {
	// 	return axios.post('/auth/refresh', data, { withCredentials: true }).then((res) => res.data);
	// };

	return { loginUser, logoutUser, registerUser, getAllUsers, getUser };
};

export default useAuthApi;
