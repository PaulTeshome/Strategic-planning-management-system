import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, tokens, useMode } from './theme';
import Layout from './components/global/Layout';
import lightBG from './assets/theme=light.svg';
import darkBG from './assets/theme=dark.svg';

function App() {
	const [theme, colorMode] = useMode();
	const colors = tokens(theme.palette.mode);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Box
					className="app"
					display="flex"
					sx={{
						height: '100vh',
						overflow: 'hidden',
						backgroundImage: theme.palette.mode === 'light' ? `url(${lightBG})` : `url(${darkBG})`,
						backgroundSize: '313.1px 200px',
						[theme.breakpoints.up('xs')]: {
							flexDirection: 'column-reverse',
						},
						[theme.breakpoints.up('md')]: {
							flexDirection: 'row',
						},
					}}
				>
					<Layout />
				</Box>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
