export function convertStringToNumber(value: string): number | null {
  const parsedNumber = Number(value);

  // Verifica se o valor é NaN (Not-a-Number)
  if (isNaN(parsedNumber)) {
    return null; // Ou lance um erro, se preferir.
  }

  return parsedNumber;
}
