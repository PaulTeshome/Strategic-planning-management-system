import axios from 'axios';
// import { axiosPrivate } from './config';

const useStaffApi = () => {
	const createStaff = (data) => {
		return axios.post('/staff/', data).then((res) => res.data);
	};

	const getStaffByHospital = ({ queryKey }) => {
		const [, type, hospital_id] = queryKey;

		return axios.get(`/staff/${hospital_id}/${type}`).then((res) => res.data);
	};

	const getStaff = ({ queryKey }) => {
		const [, user_id] = queryKey;
		// console.log('🚀 ~ getStaff ~ user_id:', user_id);

		return axios.get(`/staff/${user_id}`).then((res) => res.data);
	};

	return { createStaff, getStaffByHospital, getStaff };
};

export default useStaffApi;
