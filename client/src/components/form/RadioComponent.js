import { useTheme } from '@emotion/react';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

function RadioComponent({ touched, error, label, name, value, onChange, onBlur, radios }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<FormControl error={touched && Boolean(error)} pl={2} required>
			<FormLabel id={`${name}-radio`} sx={{ fontSize: '14px' }}>
				{label}
			</FormLabel>
			<RadioGroup
				aria-labelledby={`${name}-radio`}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				sx={{ pl: 2 }}
				name={name}
				row
			>
				{radios.map((radio, index) => (
					<FormControlLabel
						key={index + radio.label}
						value={radio.value}
						control={
							<Radio
								sx={{
									'&.Mui-checked': {
										color: colors.blueAccent[200],
									},
								}}
							/>
						}
						label={radio.label}
					/>
				))}
			</RadioGroup>
			<FormHelperText>{touched && error}</FormHelperText>
		</FormControl>
	);
}

export default RadioComponent;
