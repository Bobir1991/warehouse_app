class Operation {
  #date;
  #qty;

  constructor(type, name, qty, price, contact) {
    this.type = type;
    this.name = name;
    this.#qty = Number(qty);
    this.price = Number(price);
    this.contact = contact;
    this.#date = new Date().toISOString();
  }

  get date() {
    return this.#date;
  }

  set qty(value) {
    if (value <= 0) throw new Error('Количество должно быть больше нуля');
    this.#qty = value;
  }

  get qty() {
    return this.#qty;
  }

  static formatDate(isoString) {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU')}`;
  }

  calculateImpact() {
    return 0;
  }
}

class Income extends Operation {
  constructor(name, qty, price, contact) {
    super('income', name, qty, price, contact);
  }
  calculateImpact() {
    return this.qty;
  }
}

class Outcome extends Operation {
  constructor(name, qty, price, contact) {
    super('outcome', name, qty, price, contact);
  }
  calculateImpact() {
    return -this.qty;
  }
}

module.exports = { Operation, Income, Outcome };
