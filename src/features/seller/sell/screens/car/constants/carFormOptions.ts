export const CAR_CONDITION_OPTIONS = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
  { label: 'REFURBISHED', value: 'REFURBISHED' },
];

export const CAR_NEGOTIABLE_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const CAR_FUEL_TYPE_OPTIONS = [
  { label: 'PETROL', value: 'PETROL' },
  { label: 'DIESEL', value: 'DIESEL' },
  { label: 'CNG', value: 'CNG' },
  { label: 'ELECTRIC', value: 'ELECTRIC' },
  { label: 'HYBRID', value: 'HYBRID' },
];

export const CAR_TRANSMISSION_OPTIONS = [
  { label: 'MANUAL', value: 'MANUAL' },
  { label: 'AUTOMATIC', value: 'AUTOMATIC' },
];

export const CAR_BOOLEAN_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const CAR_MIN_YEAR = 1990;
export const CAR_CURRENT_YEAR = new Date().getFullYear();

export const buildCarYearOptions = (
  currentYear: number = CAR_CURRENT_YEAR,
  minYear: number = CAR_MIN_YEAR,
): string[] => {
  const years: string[] = [];
  for (let year = currentYear; year >= minYear; year -= 1) {
    years.push(year.toString());
  }
  return years;
};
