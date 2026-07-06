export const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString('de-DE', {
    month: 'short',
    year: 'numeric',
  });