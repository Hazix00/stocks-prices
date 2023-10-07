/**
 * Returns the name of the month based on the month number.
 * @param monthNumber The month number (1-12)
 * @returns The name of the month in French.
 */
export function getMonthName(monthNumber: number): string {
  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return monthNames[monthNumber - 1]; // Adjust for zero-based array indexing
}
