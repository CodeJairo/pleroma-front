export function allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.key;
  if (!/^\d$/.test(charCode)) {
    event.preventDefault();
  }
}

export function allowOnlyNumbersAndHyphens(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const char = event.key;

  // Permitir solo dígitos y un solo guion
  const isNumber = /^[0-9]$/.test(char);
  const isHyphen = char === '-';

  if (!isNumber && !isHyphen) {
    event.preventDefault();
  }

  // Si ya hay un guion, no permitir otro
  if (isHyphen && currentValue.includes('-')) {
    event.preventDefault();
  }
}
