export function formatDate(dateOfBirth) {
	const date = new Date(dateOfBirth); // Parse the date string

	const year = date.getFullYear(); // Get the full year
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and format to 2 digits
	const day = String(date.getDate()).padStart(2, '0'); // Get day and format to 2 digits

	return `${day}-${month}-${year}`; // Return formatted date
}
