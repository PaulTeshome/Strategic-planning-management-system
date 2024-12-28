import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

function PasswordComponent({ id, name, label, variant, value, onChange, onBlur, error, helperText, required }) {
	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	return (
		<TextField
			id={id}
			name={name}
			fullWidth
			label={label}
			required={required}
			type={showPassword ? 'text' : 'password'}
			variant={variant}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			error={error}
			helperText={helperText}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton onClick={handleShowPassword}>
							{showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
}

export default PasswordComponent;
