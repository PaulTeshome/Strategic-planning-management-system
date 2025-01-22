import axios from './config';

const usePlanApi = () => {
	const addStrategicPlan = (data) => {
		return axios.post('/strategicPlan', data, { withCredentials: true }).then((res) => res.data);
	};

	const updateSchedule = (data) => {
		return axios.patch(`/strategicPlan/${data.id}`, data, { withCredentials: true }).then((res) => res.data);
	};

	const getPlan = ({ queryKey }) => {
		const [, plan_id] = queryKey;

		return axios.get(`/strategicPlan/${plan_id}`, { withCredentials: true }).then((res) => res.data);
	};
	const getAllPlans = ({ queryKey }) => {
		return axios.get('/strategicPlan/', { withCredentials: true }).then((res) => res.data);
	};

	const getBy = ({ queryKey }) => {
		const [, year, department, status] = queryKey;
		return axios
			.get(`/strategicPlan?year=${year}&status=${status}&department=${department}`, { withCredentials: true })
			.then((res) => res.data);
	};
	// const refreshToken = (data) => {
	// 	return axios.post('/auth/refresh', data, { withCredentials: true }).then((res) => res.data);
	// };

	return { getPlan, getAllPlans, updateSchedule, getBy, addStrategicPlan };
};

export default usePlanApi;
