export const MOBILE_CONDITION_OPTIONS = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

export const MOBILE_NEGOTIABLE_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const MOBILE_MIN_YEAR = 1990;
export const MOBILE_CURRENT_YEAR = new Date().getFullYear();

export const buildMobileYearOptions = (
  currentYear: number = MOBILE_CURRENT_YEAR,
  minYear: number = MOBILE_MIN_YEAR,
): string[] => {
  const years: string[] = [];
  for (let year = currentYear; year >= minYear; year -= 1) {
    years.push(year.toString());
  }
  return years;
};
