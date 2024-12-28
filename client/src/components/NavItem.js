import { useTheme } from '@emotion/react';
import React from 'react';
import { tokens } from '../theme';
import { Collapse, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function NavItem({ title, to, icon, isCollapsed }) {
	const location = useLocation();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<ListItemButton
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				p: 1,

				'& .MuiListItemIcon-root': {
					color: location.pathname === to ? colors.blueAccent[200] : colors.black,
				},
				[theme.breakpoints.down('md')]: {
					'& .MuiListItemIcon-root': {
						fontSize: '12px',
					},
				},
				[theme.breakpoints.up('md')]: {
					'& .MuiListItemIcon-root': {
						fontSize: '18px',
					},
				},
			}}
			selected={location.pathname === to}
			component={Link}
			to={to}
		>
			<ListItemIcon
				sx={{
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</ListItemIcon>

			<Collapse in={!isCollapsed}>
				<Typography variant="caption" color={location.pathname === to ? colors.blueAccent[200] : colors.black}>
					{title}
				</Typography>
			</Collapse>
		</ListItemButton>
	);
}

export default NavItem;
