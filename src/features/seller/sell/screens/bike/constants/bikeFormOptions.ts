export const BIKE_FUEL_TYPE_OPTIONS = [
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'CNG', value: 'CNG' },
];

export const BIKE_MIN_YEAR = 1990;
export const BIKE_CURRENT_YEAR = new Date().getFullYear();

export const buildBikeYearOptions = (
  currentYear: number = BIKE_CURRENT_YEAR,
  minYear: number = BIKE_MIN_YEAR,
): string[] => {
  const years: string[] = [];
  for (let year = currentYear; year >= minYear; year -= 1) {
    years.push(year.toString());
  }
  return years;
};
