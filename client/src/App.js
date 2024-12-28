import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, tokens, useMode } from './theme';
import Layout from './components/global/Layout';

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
