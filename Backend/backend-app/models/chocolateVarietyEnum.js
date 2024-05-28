const ChocolateVarietyEnum = {
    Milk: 'Milk',
    Dark: 'Dark',
    White: 'White',
    Nuts: 'Nuts',
    Raisins: 'Raisins',
    Nougat: 'Nougat'
};

Object.freeze(ChocolateVarietyEnum); // This makes the object immutable
  
module.exports = ChocolateVarietyEnum;