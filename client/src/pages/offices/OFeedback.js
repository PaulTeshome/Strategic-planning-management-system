import { useTheme } from '@emotion/react';
import { Grid2, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../theme';
import useFeedbackApi from '../../api/feedback';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import FeedbackCard from '../../components/FeedbackCard';

function OFeedback() {
	const theme = useTheme();

	const colors = tokens(theme.palette.mode);
	const [feedbacks, setFeedbacks] = useState([]);
	const { getAllFeedbacks } = useFeedbackApi();

	const getFeedbackQuery = useQuery({
		queryKey: ['feedbacks', null],
		queryFn: getAllFeedbacks,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getFeedbackQuery.status === 'error') {
			// console.log('🚀 ~ Patients ~ getFeedbackQuery.error:', getFeedbackQuery.error);
			toast.error(getFeedbackQuery.error?.response?.data?.message || getFeedbackQuery.error.message, {
				id: 'get feedback',
			});
		}
	}, [getFeedbackQuery.status, getFeedbackQuery.error]);

	useMemo(() => {
		if (getFeedbackQuery.status === 'success') {
			// console.log('🚀 ~ useMemo ~ getFeedbackQuery', getFeedbackQuery.data);
			const planData = getFeedbackQuery.data?.data?.data || [];
			console.log('🚀 ~ useMemo ~ planData:', planData);

			setFeedbacks([...planData]);
		}
	}, [getFeedbackQuery.status, getFeedbackQuery.data]);

	return (
		<Grid2
			container
			display="flex"
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="felx-start"
			width="100%"
			height="fit-content"
			minHeight={600}
			gap={2}
			borderRadius="5px"
			boxShadow={5}
			p={4}
			bgcolor={colors.white}
		>
			<Grid2 size={{ xs: 10 }}>
				<Typography variant="h5" component="p" fontWeight="bold">
					View Feedback
				</Typography>
			</Grid2>
			{feedbacks.map((feedback, index) => (
				<Grid2 key={index} size={{ xs: 10 }}>
					<FeedbackCard
						plan_id={feedback.plan_id}
						user_id={feedback.user_id}
						message={feedback.message}
						createdAt={feedback.createdAt}
					/>
				</Grid2>
			))}
		</Grid2>
	);
}

export default OFeedback;
