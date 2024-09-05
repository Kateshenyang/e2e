import { validateCardNumber } from '../src/js/validator';

test('validates a correct card number', () => {
  expect(validateCardNumber('4111111111111111')).toBe(true); // Visa test card number
});

test('invalidates an incorrect card number', () => {
  expect(validateCardNumber('1234567812345678')).toBe(false); // Invalid card number
});