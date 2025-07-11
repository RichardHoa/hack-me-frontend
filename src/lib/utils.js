export function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString();
}

export const DEFAULT_PAGE_SIZE = 5;
