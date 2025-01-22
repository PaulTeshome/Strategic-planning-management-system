import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

function SelectComponent({ touched, error, label, name, value, disabled, onChange, onBlur, options, required }) {
	return (
		<FormControl fullWidth>
			<InputLabel id={`${label}-select`} error={touched && Boolean(error)}>
				{label}
			</InputLabel>
			<Select
				labelId={`${label}-select`}
				id={name}
				name={name}
				fullWidth
				required={required}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				disabled={disabled}
				error={touched && Boolean(error)}
			>
				{options.map((option, index) => (
					<MenuItem key={index + option.label} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>

			{touched && Boolean(error) && (
				<FormHelperText sx={{ ml: 2 }} error>
					{error}
				</FormHelperText>
			)}
		</FormControl>
	);
}

export default SelectComponent;
