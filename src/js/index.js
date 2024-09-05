import { validateCardNumber } from './validator';
import { getCardType } from './cardType';

document.getElementById('validate-btn').addEventListener('click', () => {
  const cardNumber = document.getElementById('card-number').value;
  const isValid = validateCardNumber(cardNumber);
  const cardType = getCardType(cardNumber);

  if (isValid) {
    alert(`Card is valid and it is a ${cardType}`);
  } else {
    alert('Card is invalid');
  }
});