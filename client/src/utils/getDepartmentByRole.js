export const getDepartmentByRole = (role) => {
	const roleToDepartmentMap = {
		vp: 'President Office',
		spd: 'Strategic Planning Directorate',
		vpo: 'Vice President Office',
		av: 'Academic Affairs Vice President',
		ado: 'Administrative Development Vice President',
		rv: 'Research and Technology Transfer Vice President',
		none: 'Unassigned Department', // Default department for unknown roles
	};

	// Return the department name or a fallback for unmatched roles
	return roleToDepartmentMap[role] || 'General Department';
};
