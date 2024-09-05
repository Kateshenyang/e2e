export function getCardType(number) {
  const visaRegex = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
  const mastercardRegex = new RegExp('^5[1-5][0-9]{14}$');
  const mirRegex = new RegExp('^220[0-4][0-9]{12}$');

  if (visaRegex.test(number)) {
    return 'Visa';
  } else if (mastercardRegex.test(number)) {
    return 'Mastercard';
  } else if (mirRegex.test(number)) {
    return 'Mir';
  } else {
    return 'Unknown';
  }
}
