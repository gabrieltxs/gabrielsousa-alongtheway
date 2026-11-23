const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];

// All dates are treated as UTC so a post dated 2026-11-22 never shows as the 21st.

export function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

// "22 November 2026"
export function longDate(date: Date): string {
	return `${date.getUTCDate()} ${MONTHS_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "Nov 22"
export function shortDate(date: Date): string {
	return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

// 'YYYY' or 'YYYY-MM' -> "2024" or "Mar 2024"
export function monthYear(value: string): string {
	const [year, month] = value.split('-');
	return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

// "Mar 2024 to present", "2024 to 2025", "2025"
export function period(start: string, end: string): string {
	const from = monthYear(start);
	const to = end ? monthYear(end) : 'present';
	return from === to ? from : `${from} to ${to}`;
}
