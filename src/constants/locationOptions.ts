export const ORIGIN_OPTIONS = [10, 20, 30, 40] as const;
export const DESTINATION_OPTIONS = [50, 60, 70, 80] as const;

export const ORIGIN_OPTION_LABELS: Record<(typeof ORIGIN_OPTIONS)[number], string> = {
  10: 'Mumbai',
  20: 'Delhi',
  30: 'Bengaluru',
  40: 'Hyderabad'
};

export const DESTINATION_OPTION_LABELS: Record<(typeof DESTINATION_OPTIONS)[number], string> = {
  50: 'Pune',
  60: 'Chennai',
  70: 'Kolkata',
  80: 'Ahmedabad'
};
