
const month_names = [
  'January',
  'Februrary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const jcdUtil = {
  getDisplayDate: getDisplayDate,
} as const;

function getDisplayDate(monthVal: number): typeof month_names[number] | undefined {
  return month_names[monthVal - 1];
}
