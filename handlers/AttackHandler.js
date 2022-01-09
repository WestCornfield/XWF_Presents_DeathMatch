class AttackHandler {
  constructor() {

  }

  rollDamage() {
    const diceRoll = Math.floor(Math.random() * 200);

    return this.checkDamage(diceRoll);
  }

  checkDamage(diceRoll) {
    if (diceRoll <= 5) {
      return Math.floor(Math.random() * 5) - 5;
    } else if (diceRoll <= 9) {
      return 0;
    } else if (diceRoll <= 69) {
      return Math.floor(Math.random() * 5) + 1;
    } else if (diceRoll <= 119) {
      return Math.floor(Math.random() * 5) + 6;
    } else if (diceRoll <= 159) {
      return Math.floor(Math.random() * 5) + 11;
    } else if (diceRoll <= 179) {
      return Math.floor(Math.random() * 5) + 16;
    } else if (diceRoll <= 189) {
      return Math.floor(Math.random() * 5) + 21;
    } else if (diceRoll <= 191) {
      return Math.floor(Math.random() * 5) + 26;
    } else if (diceRoll <= 195) {
      return Math.floor(Math.random() * 5) + 31;
    } else if (diceRoll <= 198) {
      return Math.floor(Math.random() * 5) + 36;
    } else if (diceRoll === 199) {
      return Math.floor(Math.random() * 10) + 40;
    }
  }
};

module.exports = { AttackHandler };
