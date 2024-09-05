export function validateCardNumber(number) {
    const regex = new RegExp('^[0-9]{16}$');
    if (!regex.test(number)) return false;
  
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      let intVal = parseInt(number.substr(i, 1));
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) intVal = 1 + (intVal % 10);
      }
      sum += intVal;
    }
    return sum % 10 === 0;
  }