import axios from './config';

const usePlanApi = () => {
	const addStrategicPlan = (data) => {
		return axios.post('/strategicPlan', data, { withCredentials: true }).then((res) => res.data);
	};

	const updatePlan = (data) => {
		const { plan_id, ...rest } = data;
		return axios.patch(`/strategicPlan/${plan_id}`, { ...rest }, { withCredentials: true }).then((res) => res.data);
	};

	const getPlan = ({ queryKey }) => {
		const [, plan_id, status] = queryKey;

		return axios
			.get(`/strategicPlan?_id=${plan_id}&status=${status}`, { withCredentials: true })
			.then((res) => res.data);
	};

	const getAllPlans = ({ queryKey }) => {
		return axios.get('/strategicPlan/', { withCredentials: true }).then((res) => res.data);
	};

	const getBy = ({ queryKey }) => {
		const [, year, department, status] = queryKey;
		console.log('🚀 ~ getBy ~ department:', department);

		let query = '';

		if (year !== null) {
			query = query + `year=${year}&`;
		}
		if (department !== null && department !== 'all') {
			query = query + `department=${department}&`;
		}
		if (status !== null) {
			query = query + `status=${status}`;
		}
		console.log('🚀 ~ getBy ~ query:', query);
		return axios.get(`/strategicPlan?${query}`, { withCredentials: true }).then((res) => res.data);
	};

	return { getPlan, updatePlan, getAllPlans, getBy, addStrategicPlan };
};

export default usePlanApi;
