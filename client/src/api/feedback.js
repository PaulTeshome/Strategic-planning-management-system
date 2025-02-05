import axios from './config';

const useFeedbackApi = () => {
	const addFeedback = (data) => {
		return axios.post('/feedback', data, { withCredentials: true }).then((res) => res.data);
	};

	const getAllFeedbacks = ({ queryKey }) => {
		const [, plan_id] = queryKey;

		let query = '';

		if (plan_id !== null) {
			query = query + `plan_id=${plan_id}&`;
		}

		return axios.get(`/feedback?${query}`, { withCredentials: true }).then((res) => res.data);
	};

	return { addFeedback, getAllFeedbacks };
};

export default useFeedbackApi;
