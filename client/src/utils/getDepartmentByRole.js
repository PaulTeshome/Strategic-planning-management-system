export const getDepartmentByRole = (role) => {
	const roleToDepartmentMap = {
		vp: 'Vice President',
		spd: 'Strategy and Planning Directorate',
		vpo: 'Vice President Office',
		av: 'Academic Vice Office',
		ado: 'Administrative Vice Office',
		rv: 'Research Vice Office',
		none: 'Unassigned Department', // Default department for unknown roles
	};

	// Return the department name or a fallback for unmatched roles
	return roleToDepartmentMap[role] || 'General Department';
};
