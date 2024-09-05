import { getCardType } from '../src/js/cardType';

test('identifies Visa card type', () => {
  expect(getCardType('4111111111111111')).toBe('Visa');
});

test('identifies Mastercard card type', () => {
  expect(getCardType('5105105105105100')).toBe('Mastercard');
});

test('identifies Mir card type', () => {
  expect(getCardType('2200777777777777')).toBe('Mir');
});

test('returns unknown for unrecognized card type', () => {
  expect(getCardType('1234567812345678')).toBe('Unknown');
});
