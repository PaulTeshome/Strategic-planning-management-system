import axios from './config';

const useReportApi = () => {
	const addReport = (data) => {
		return axios.post('/reports', data, { withCredentials: true }).then((res) => res.data);
	};

	const updateReport = (data) => {
		const { report_id, ...rest } = data;
		return axios.patch(`/reports/${report_id}`, { ...rest }, { withCredentials: true }).then((res) => res.data);
	};

	const getReport = ({ queryKey }) => {
		const [, plan_id, status] = queryKey;
		let query = '';

		if (status !== null) {
			query = query + `&status=${status}`;
		}
		return axios.get(`/reports/?_id=${plan_id}${query}`, { withCredentials: true }).then((res) => res.data);
	};

	const getAllReports = ({ queryKey }) => {
		return axios.get('/reports/', { withCredentials: true }).then((res) => res.data);
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
		return axios.get(`/reports/?${query}`, { withCredentials: true }).then((res) => res.data);
	};

	return { getReport, updateReport, getAllReports, getBy, addReport };
};

export default useReportApi;
