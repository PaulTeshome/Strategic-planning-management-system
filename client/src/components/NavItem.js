import { useTheme } from '@emotion/react';
import React from 'react';
import { tokens } from '../theme';
import { ListItemButton, ListItemIcon, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function NavItem({ title, to, icon, isCollapsed }) {
	const location = useLocation();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<ListItemButton
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
				justifyContent: 'left',
				width: '100%',
				backgroundColor: location.pathname === to ? colors.grey[700] : 'transparent',
				borderRadius: '5px',
				gap: 2,
				p: 2,

				'& .MuiListItemIcon-root': {
					color: location.pathname === to ? colors.aastuBlue[700] : colors.textBlue[500],
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
			<Typography
				variant="subtitle2"
				color={location.pathname === to ? colors.aastuBlue[700] : colors.textBlue[500]}
			>
				{title}
			</Typography>
		</ListItemButton>
	);
}

export default NavItem;
