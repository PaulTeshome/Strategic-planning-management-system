import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { MyContextProvider } from './utils/MyContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './utils/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MyContextProvider>
				<BrowserRouter>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<AuthProvider>
							<App />
						</AuthProvider>
					</LocalizationProvider>
				</BrowserRouter>
			</MyContextProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
