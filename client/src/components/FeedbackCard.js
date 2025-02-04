import { Grid2, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../theme';
import usePlanApi from '../api/plan';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuthApi from '../api/auth';
import { formatDate } from '../utils/formatDate';

function FeedbackCard({ plan_id, user_id, message, createdAt }) {
	console.log('🚀 ~ FeedbackCard ~ plan_id, user_id, message, createdAt:', plan_id, user_id, message, createdAt);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { getPlan } = usePlanApi();
	const [plan, setPlan] = useState({});
	const [user, setUser] = useState({});

	const { getUser } = useAuthApi();

	const getUserQuery = useQuery({
		queryKey: ['user', user_id],
		queryFn: getUser,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getUserQuery.status === 'error') {
			// // console.log('🚀 ~ Patients ~ getUserQuery.error:', getUserQuery.error);
			toast.error(
				getUserQuery.error?.response?.data?.message || getUserQuery.error.message || 'Error getting users'
			);
		}
	}, [getUserQuery.status, getUserQuery.error]);

	useMemo(() => {
		if (getUserQuery.status === 'success') {
			// console.log('🚀 ~ useMemo ~ getUserQuery.data:', getUserQuery.data.data);
			const patientList = getUserQuery.data?.data?.data[0];
			setUser({ ...patientList });
		}
	}, [getUserQuery.status, getUserQuery.data]);

	const getPlanQuery = useQuery({
		queryKey: ['plan', plan_id, null],
		enabled: plan_id !== undefined && plan_id !== null,
		queryFn: getPlan,
		staleTime: 1000 * 60 * 5,
		// retry: false,
	});

	useEffect(() => {
		if (getPlanQuery.status === 'error') {
			// // console.log('🚀 ~ Patients ~ getPlanQuery.error:', getPlanQuery.error);
			toast.error(getPlanQuery.error?.response?.data?.message || getPlanQuery.error.message, {
				id: 'getPlan',
			});
		}
	}, [getPlanQuery.status, getPlanQuery.error]);

	useMemo(() => {
		if (getPlanQuery.status === 'success') {
			console.log('🚀 ~ useMemo ~ getPlan', getPlanQuery.data);
			const planData = getPlanQuery.data?.data?.data[0] || {};

			setPlan({ ...planData });
		}
	}, [getPlanQuery.status, getPlanQuery.data]);
	return (
		<Grid2
			container
			width="100%"
			border={1.5}
			borderRadius={1}
			borderColor={colors.redAccent[400]}
			bgcolor={colors.aastuGold[200]}
			p={1}
			display="flex"
			maxHeight="fit-content"
			minHeight={100}
			gap={2}
		>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="body1" fontWeight="bold" component="p" color={colors.textBlue[500]}>
					{'Plan for ' + plan?.year}
				</Typography>
				<Typography variant="body2" fontWeight="bold" component="p" color={colors.textBlue[500]}>
					{'Feedback by ' + user?.fullName}
				</Typography>
			</Grid2>

			<Grid2 size={{ xs: 12 }}>
				<Typography variant="body2" component="p" color={colors.textBlue[500]}>
					{message}
				</Typography>
			</Grid2>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="body2" component="p" color={colors.textBlue[500]}>
					{'Feedback given on ' + formatDate(createdAt)}
				</Typography>
			</Grid2>
		</Grid2>
	);
}

export default FeedbackCard;
