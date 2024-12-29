export const roleSetter = (parsedUser) => {
	let role = null;
	const randomNum = parsedUser.r_data;
	switch (true) {
		case randomNum >= 575 && randomNum <= 967:
			role = 'vp';
			break;
		case randomNum >= 158 && randomNum <= 498:
			role = 'strategic';
			break;
		case randomNum >= 1045 && randomNum <= 1548:
			role = 'office';
			break;
		default:
			role = 'none';
	}
	return role;
};
