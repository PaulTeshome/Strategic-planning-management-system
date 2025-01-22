import { Stack, styled, TableCell, tableCellClasses, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../theme';
import { Edit, Save } from '@mui/icons-material';

function CustomizableCell({ style, type, label, name, onBlur, onChange, value, error, helperText }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const TableBodyCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.body}`]: {
			fontSize: '10px',
			borderRight: `1px solid ${colors.grey[500]}`,
		},
	}));

	const [editable, setEditable] = useState(true);

	return (
		<TableBodyCell style={style}>
			<Stack direction="row" display="flex" alignItems="center" justifyContent="center" gap={0.5}>
				{editable ? (
					<TextField
						slotProps={{
							inputLabel: { shrink: true },
						}}
						fullWidth
						size="small"
						type={type}
						label={label}
						name={name}
						onBlur={onBlur}
						onChange={onChange}
						value={value}
						error={error}
						helperText={helperText}
					/>
				) : (
					<Typography>{value}</Typography>
				)}
				{editable ? (
					<Save
						onClick={() => {
							setEditable(false);
						}}
					/>
				) : (
					<Edit
						onClick={() => {
							setEditable(true);
						}}
					/>
				)}
			</Stack>
		</TableBodyCell>
	);
}

export default CustomizableCell;
