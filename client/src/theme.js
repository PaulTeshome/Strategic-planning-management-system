import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// color design tokens export
export const tokens = (mode) => ({
	...(mode === 'dark'
		? {
				white: '#000000',
				black: '#c2c2c2',
				grey: {
					100: '#141414',
					200: '#292929',
					300: '#3d3d3d',
					400: '#525252',
					500: '#666666',
					600: '#858585',
					700: '#a3a3a3',
					800: '#000000',
					900: '#e0e0e0',
				},
				primary: {
					100: '#162A5C', // Darkest light shade
					200: '#1A3A7A', // Darker still
					300: '#1F4F99', // Darker shade
					400: '#2A6BCC', // Base light mode color
					500: '#4D8CFF', // Medium light
					600: '#80B0FF', // Light
					700: '#B3D6FF', // Lighter shade
					800: '#E3EFFF', // Lightest shade
				},
				greenAccent: {
					100: '#dbf5ee',
					200: '#b7ebde',
					300: '#94e2cd',
					400: '#70d8bd',
					500: '#4cceac',
					600: '#3da58a',
					700: '#2e7c67',
					800: '#1e5245',
					900: '#0f2922',
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
				blueAccent: {
					50: '#273240',
					100: '#0a4356',
					200: '#008cd5',
					300: '#0a4356',
					400: '#003f7d',
					600: '#2c3e4e',
				},
			}
		: {
				white: '#ffffff',
				black: '#000000',
				grey: {
					100: '#e0e0e0',
					200: '#c2c2c2',
					300: '#a3a3a3',
					400: '#858585',
					500: '#666666',
					600: '#525252',
					700: '#3d3d3d',
					800: '#ededed',
					900: '#141414',
				},
				primary: {
					100: '#E3EFFF', // Lightest shade
					200: '#B3D6FF', // Light
					300: '#80B0FF', // Medium light
					400: '#4D8CFF', // Base light mode color
					500: '#2A6BCC', // Slightly darker
					600: '#1F4F99', // Darker shade
					700: '#1A3A7A', // Darker still
					800: '#162A5C', // Darkest light shade
				},
				greenAccent: {
					100: '#0f2922',
					200: '#1e5245',
					300: '#2e7c67',
					400: '#3da58a',
					500: '#4cceac',
					600: '#70d8bd',
					700: '#94e2cd',
					800: '#b7ebde',
					900: '#dbf5ee',
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
				blueAccent: {
					50: '#BFE0FF',
					100: '#55ddee',
					200: '#0088de',
					300: '#55ddee',
					400: '#0083FC',
					600: '#76AACA',
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
						borderRadius: '20px',
						'&:disabled': {
							cursor: 'not-allowed',
							pointerEvents: 'all !important',
						},
					},

					contained: {
						background: `linear-gradient(to right, ${colors.blueAccent[100]}  0%, ${colors.blueAccent[200]}  80%)`,
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
						border: `1px solid ${colors.blueAccent[200]}`,
						color: `${colors.blueAccent[200]}`,
						'&:hover': {
							border: `1px solid ${colors.primary[600]}`,
							color: `${colors.primary[600]}`,
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
						color: `${colors.blueAccent[200]}`,
					},
				},
			},

			MuiDateCalendar: {
				styleOverrides: {
					root: {
						backgroundColor: `${colors.grey[100]}`,
						borderRadius: '20px',
					},
				},
			},
			MuiPickersDay: {
				styleOverrides: {
					root: {
						backgroundColor: `${colors.grey[100]}`,
					},
					'&.Mui-selected': {
						backgroundColor: `${colors.blueAccent[500]}`,
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
			...(mode === 'dark'
				? {
						// palette values for dark mode
						primary: {
							main: colors.blueAccent[200],
						},
						secondary: {
							main: colors.greenAccent[500],
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100],
						},
						background: {
							default: colors.primary[500],
						},
					}
				: {
						// palette values for light mode
						primary: {
							main: colors.blueAccent[200],
						},
						secondary: {
							main: colors.greenAccent[500],
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100],
						},
						background: {
							default: colors.grey[800],
						},
					}),
		},
		typography: {
			fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
			fontSize: 12,
			h1: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 40,
			},
			h2: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 32,
			},
			h3: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 24,
			},
			h4: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 20,
			},
			h5: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 16,
			},
			h6: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
				fontSize: 14,
			},
			caption: {
				fontFamily: ['Tenor Sans', 'sans-serif'].join(','),
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
