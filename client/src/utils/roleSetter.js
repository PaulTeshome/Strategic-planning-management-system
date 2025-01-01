export const roleSetter = (parsedUser) => {
	let role = null;
	const randomNum = parsedUser.r_data;

	// Define ranges for each role
	const ranges = {
		vp: [100, 500], // Example range: 100-500
		spd: [501, 700], // Example range: 501-700
		vpo: [701, 900], // Example range: 701-900
		av: [901, 1100], // Example range: 901-1100
		ado: [1101, 1300], // Example range: 1101-1300
		rv: [1301, 1500], // Example range: 1301-1500
	};

	// Iterate over the ranges and assign the appropriate role
	for (const [key, [min, max]] of Object.entries(ranges)) {
		if (randomNum >= min && randomNum <= max) {
			role = key;
			break;
		}
	}

	// Default role if no match
	if (!role) {
		role = 'none';
	}

	return role;
};
