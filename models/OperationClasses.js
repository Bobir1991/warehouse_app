class Operation{
    #date;
    #quantity;
    constructor(type, name, quantity, price, contact){
        this.type = type;
        this.name = name;
        this.#quantity = Number(quantity);
        this.price = Number(price);
        this.contact = contact;
        this.#date = new Date().toISOString();
    }
    get date(){
    return this.#date;
    }
    set quantity(value){
        if (value<=0) throw new Error ('Количество должно быть > 0');
        this.#quantity = value;
    }
    get quantity(){
        return this.#quantity;
    }
    static formatDate(isoString){
        const d = new Date(isoString);
        return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU')}`;
    }
    calculateImpact(){
        return 0;
    }
}
class Income extends Operation{
    constructor(name, quantity, price, contact){
        super('income', name, quantity, price, contact);
    }
    calculateImpact(){
        return this.quantity;
    }
}    
class Outcome extends Operation{
    constructor(name, quantity, price, contact){
        super('outcome', name, quantity, price, contact);
    }
    calculateImpact(){
        return -this.quantity;
    }
} 
module.exports = {Operation, Income, Outcome};
