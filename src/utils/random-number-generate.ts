export const randomNumberWithDigits = () => {
  // Defina quantos dígitos o número terá (1 a 4)
  const digits = Math.floor(Math.random() * 4) + 1;

  // Defina o mínimo e o máximo baseado na quantidade de dígitos
  const min = Math.pow(10, digits - 1); // Exemplo: 1, 10, 100, 1000
  const max = Math.pow(10, digits) - 1; // Exemplo: 9, 99, 999, 9999

  // Gere o número aleatório no intervalo definido
  return Math.floor(Math.random() * (max - min + 1)) + min;
}