import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// color design tokens export
export const tokens = (mode) => ({
	...(mode === 'dark'
		? {
				white: '#000000',
				black: '#c2c2c2',
				grey: {
					100: '#192b3f', // Darkest
					200: '#3a4e66', // Transitioning to lighter grey
					300: '#5b748d', // Further transition
					400: '#7c9ab4', // Closer to main color
					500: '#a8abad', // Main Color (unchanged)
					600: '#b8b8c2', // Slightly Darker (lightly adjusted)
					700: '#d0d0d5', // Medium Light (lightly adjusted)
					800: '#e1e1e6', // Light Tint (lightened)
					900: '#ffffff', // Very Light (unchanged)
				},
				aastuBlue: {
					100: '#b0c4de', // Light Tint (adjusted for dark mode)
					200: '#8fa1cb', // Medium Light (adjusted for dark mode)
					300: '#6f87b8', // Slightly Darker (adjusted for dark mode)
					400: '#4e6da5', // Main Color (adjusted for visibility)
					500: '#002951', // Main Color (same as light mode)
					600: '#001e3c', // Darker Shade (same as light mode)
					700: '#00152a', // Even Darker (same as light mode)
					800: '#000c18', // Very Dark (same as light mode)
				},
				textBlue: {
					100: '#0a121a', // Very Dark
					200: '#101c27', // Even Darker
					300: '#1a2635', // Darker Shade
					400: '#273240', // Main Color
					500: '#6f87b8', // Slightly Darker
					600: '#8fa1cb', // Medium Light
					700: '#b0c4de', // Light Tint
					800: '#e0e7f1', // Very Light
				},
				aastuGold: {
					100: '#fce6a8', // Light Tint (adjusted for dark mode)
					200: '#f9d87c', // Medium Light (adjusted for dark mode)
					300: '#f7c24f', // Slightly Darker (adjusted for dark mode)
					400: '#f1c40f', // Main Color (same as light mode)
					500: '#d4a10e', // Darker Shade (adjusted for visibility)
					600: '#b78a0d', // Even Darker (adjusted for visibility)
					700: '#9b6d0c', // Very Dark (adjusted for visibility)
					800: '#7f580b', // Darker for very dark background
				},

				greenAccent: {
					100: '#b7ebde', // Light Tint (adjusted for dark mode)
					200: '#94e2cd', // Medium Light (adjusted for dark mode)
					300: '#70d8bd', // Slightly Darker (adjusted for dark mode)
					400: '#4cceac', // Main Color (same as light mode)
					500: '#3da58a', // Darker Shade (adjusted for visibility)
					600: '#2e7c67', // Even Darker (adjusted for visibility)
					700: '#1e5245', // Very Dark (adjusted for visibility)
					800: '#0f2922', // Darkest (same as light mode)
					900: '#0a1c1a', // Darker for contrast
				},
				redAccent: {
					100: '#f8dcdb',
					200: '#f1b9b7',
					300: '#e99592',
					400: '#e2726e',
					500: '#db4f4a',
					600: '#af3f3b',
					700: '#832f2c',
					800: '#58201e',
					900: '#2c100f',
				},
			}
		: {
				white: '#ffffff',
				black: '#000000',
				grey: {
					100: '#ffffff', // Very Light
					200: '#f1f2f7', // Light Tint
					300: '#d9dbe2', // Medium Light
					400: '#c0c3cf', // Slightly Darker
					500: '#a8abbd', // Main Color
					600: '#9094a9', // Darker Shade
					700: '#787b95', // Even Darker
					800: '#60627f', // Very Dark
					900: '#484a6b', // Darkest
				},
				aastuBlue: {
					100: '#e0e7f1', // Very Light
					200: '#b0c4de', // Light Tint
					300: '#8fa1cb', // Medium Light
					400: '#6f87b8', // Slightly Darker
					500: '#002951', // Main Color
					600: '#001e3c', // Darker Shade
					700: '#00152a', // Even Darker
					800: '#000c18', // Very Dark
				},
				textBlue: {
					100: '#e0e7f1', // Very Light
					200: '#b0c4de', // Light Tint
					300: '#8fa1cb', // Medium Light
					400: '#6f87b8', // Slightly Darker
					500: '#273240', // Main Color
					600: '#1a2635', // Darker Shade
					700: '#101c27', // Even Darker
					800: '#0a121a', // Very Dark
				},
				aastuGold: {
					100: '#fef5d4', // Very Light
					200: '#fce6a8', // Light Tint
					300: '#f9d87c', // Medium Light
					400: '#f7c24f', // Slightly Darker
					500: '#f1c40f', // Main Color
					600: '#d4a10e', // Darker Shade
					700: '#b78a0d', // Even Darker
					800: '#9b6d0c', // Very Dark
				},
				greenAccent: {
					100: '#dbf5ee', // Very Light
					200: '#b7ebde', // Light Tint
					300: '#94e2cd', // Medium Light
					400: '#70d8bd', // Slightly Darker
					500: '#4cceac', // Main Color
					600: '#3da58a', // Darker Shade
					700: '#2e7c67', // Even Darker
					800: '#1e5245', // Very Dark
					900: '#0f2922', // Darkest
				},
				redAccent: {
					100: '#2c100f',
					200: '#58201e',
					300: '#832f2c',
					400: '#af3f3b',
					500: '#db4f4a',
					600: '#e2726e',
					700: '#e99592',
					800: '#f1b9b7',
					900: '#f8dcdb',
				},
			}),
});

// mui theme settings
export const themeSettings = (mode) => {
	const colors = tokens(mode);
	return {
		components: {
			// Name of the component
			MuiListItemIcon: {
				styleOverrides: {
					root: {
						// Some CSS
						color: colors.black,
						minWidth: '0px',
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: '5px',
						'&:disabled': {
							cursor: 'not-allowed',
							pointerEvents: 'all !important',
						},
					},

					contained: {
						background: colors.aastuBlue[500],
						color: 'white',
						'&:disabled': {
							background: colors.grey[800],
						},
					},
					containedError: {
						background: '#FF3131',
						color: 'white',
					},

					outlined: {
						border: `1px solid ${colors.aastuBlue[500]}`,
						color: `${colors.aastuBlue[500]}`,
						'&:hover': {
							border: `1px solid ${colors.aastuBlue[600]}`,
							color: `${colors.aastuBlue[600]}`,
						},
					},
					outlinedError: {
						border: `1px solid #FF3131`,
						'&:hover': {
							border: `1px solid #ff3190`,
							color: ' #ff3190',
						},
						color: '#FF3131',
					},
					text: {
						color: `${colors.aastuBlue[500]}`,
					},
				},
			},

			MuiDateCalendar: {
				styleOverrides: {
					root: {
						backgroundColor: `${colors.grey[100]}`,
						borderRadius: '5px',
					},
				},
			},
			MuiPickersDay: {
				styleOverrides: {
					root: {
						backgroundColor: `${colors.grey[100]}`,
					},
					'&.Mui-selected': {
						backgroundColor: `${colors.aastuBlue[500]}`,
						color: `${colors.white}`,
					},
				},
			},
			MuiPickersLayout: {
				styleOverrides: {
					root: {
						backgroundColor: 'transparent !important',
					},
				},
			},
		},
		palette: {
			error: {
				main: '#FF3131',
			},
			mode: mode,
			primary: {
				main: colors.aastuBlue[500],
			},
			secondary: {
				main: colors.aastuGold[500],
			},
			neutral: {
				dark: colors.grey[700],
				main: colors.grey[200],
				light: colors.grey[100],
			},
			background: {
				default: colors.aastuBlue[600],
			},
		},
		typography: {
			fontFamily: ['Poppins', 'sans-serif'].join(','),
			fontSize: 12,
			h1: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 40,
			},
			h2: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 32,
			},
			h3: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 24,
			},
			h4: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 20,
			},
			h5: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 16,
			},
			h6: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 14,
			},
			caption: {
				fontFamily: ['Poppins', 'sans-serif'].join(','),
				fontSize: 10,
			},
		},
	};
};

// context for color mode
export const ColorModeContext = createContext({
	toggleColorMode: () => {},
});

export const useMode = () => {
	const savedMode = localStorage.getItem('colorMode');

	const startMode = savedMode ? JSON.parse(savedMode) : 'light';

	const [mode, setMode] = useState(startMode);

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prev) => {
					const newMode = prev === 'light' ? 'dark' : 'light';
					localStorage.setItem('colorMode', JSON.stringify(newMode));
					return newMode;
				});
			},
		}),
		[]
	);

	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	return [theme, colorMode];
};
