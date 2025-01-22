import { createContext, useState } from 'react';
import { roleSetter } from './roleSetter';

const MyContext = createContext();

export default MyContext;

export const MyContextProvider = ({ children }) => {
	const [headerTitle, setHeaderTitle] = useState('');

	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('user');
		if (!storedUser) {
			return {
				user_id: '',
				user_name: '',
				// r_data: 'rv',
				r_data: '',
				// r_data: 'vp',
			};
		} else {
			const parsedUser = JSON.parse(storedUser);

			// const role = roleSetter(parsedUser);

			const savedState = { ...parsedUser };

			return savedState;
		}
	});

	const updateTitle = (newValue) => {
		setHeaderTitle(newValue);
	};

	const updateUser = (newUser) => {
		const { user_name, role_id, user_id } = newUser;

		// // Define ranges for each role
		// const roleRanges = {
		// 	1: { range: [100, 500], role: 'vp' },
		// 	2: { range: [501, 700], role: 'spd' },
		// 	3: { range: [701, 900], role: 'vpo' },
		// 	4: { range: [901, 1100], role: 'av' },
		// 	5: { range: [1101, 1300], role: 'ado' },
		// 	6: { range: [1301, 1500], role: 'rv' },
		// };

		// // Default range and role if role_id is invalid
		// const defaultRange = [0, 90];
		// const defaultRole = 'none';

		// // Get the range and role based on role_id
		// const { range } = roleRanges[role_id] || { range: defaultRange, role: defaultRole };

		// // Generate a random number within the specified range
		// const randomNum = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

		// Create user data object
		const userData = {
			user_id: user_id,
			user_name: user_name,
			r_data: role_id,
		};

		// Update the user data and persist to local storage
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};
	return (
		<MyContext.Provider
			value={{
				user,
				headerTitle,
				updateUser,
				updateTitle,
			}}
		>
			{children}
		</MyContext.Provider>
	);
};
