import { Box } from '@mui/material';
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';

function MainHolder() {
	const scrollContainerRef = useRef(null);
	return (
		<Box ref={scrollContainerRef} width="100%" height="stretch" pt={3} px={1}>
			<Outlet />
		</Box>
	);
}

export default MainHolder;
