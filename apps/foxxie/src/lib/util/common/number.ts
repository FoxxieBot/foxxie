export function toDayOfTheWeek(day: number): string {
	switch (day) {
		case 0:
			return 'Sunday';
		case 1:
			return 'Monday';
		case 2:
			return 'Tuesday';
		case 3:
			return 'Wednesday';
		case 4:
			return 'Thursday';
		case 5:
			return 'Friday';
		case 6:
			return 'Saturday';
	}

	return '';
}

export function toMonthString(month: number | string): string {
	switch (month) {
		case 0:
		case '0':
			return 'January';
		case 1:
		case '1':
			return 'February';
		case 10:
		case '10':
			return 'November';
		case 11:
		case '11':
			return 'December';
		case 2:
		case '2':
			return 'March';
		case 3:
		case '3':
			return 'April';
		case 4:
		case '4':
			return 'May';
		case 5:
		case '5':
			return 'June';
		case 6:
		case '6':
			return 'July';
		case 7:
		case '7':
			return 'August';
		case 8:
		case '8':
			return 'September';
		case 9:
		case '9':
			return 'October';
		default:
			return '';
	}
}

export function toStarboardStatsEmoji(stars: number) {
	if (stars === 0) return '';
	if (stars < 20) return '⭐';
	if (stars < 50) return '🌟';
	if (stars < 100) return '💫';
	if (stars < 250) return '✨';
	if (stars < 500) return '🌠';
	return '🌌';
}
