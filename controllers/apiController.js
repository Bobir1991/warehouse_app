const fs = require('fs').promises;
const { Income, Outcome } = require('../models/OperationClasses');
const { ValidationError } = require('../models/CustomErrors');

const DB_FILE = './data/db.json';

async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    await fs.mkdir('./data', { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify({ stock: {}, operations: [] }));
  }
}
initDB();

const getWarehouseData = async (req, res, next) => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    next(error);
  }
};

const addOperation = async (req, res, next) => {
  try {
    const { type, name, qty, price, contact } = req.body;
    
    if (!name || !qty || qty <= 0) {
      throw new ValidationError('Некорректные данные операции');
    }

    let op;
    if (type === 'income') op = new Income(name, qty, price, contact);
    else if (type === 'outcome') op = new Outcome(name, qty, price, contact);
    else throw new ValidationError('Неизвестный тип операции');

    const rawData = await fs.readFile(DB_FILE, 'utf8');
    const db = JSON.parse(rawData);

    const currentStock = db.stock[name] || 0;
    const impact = op.calculateImpact();
    
    if (type === 'outcome' && currentStock + impact < 0) {
      throw new ValidationError(`Недостаточно товара "${name}" на складе. В наличии: ${currentStock}`);
    }

    db.stock[name] = currentStock + impact;
    
    db.operations.push({
      type: op.type,
      name: op.name,
      qty: op.qty,
      price: op.price,
      contact: op.contact,
      date: op.date
    });

    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'Операция успешно добавлена' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWarehouseData, addOperation };