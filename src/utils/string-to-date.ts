export const StringToDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);

  // Cria a data no formato correto
  const date = new Date(year, month - 1, day); // Mês é zero-indexado

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};
