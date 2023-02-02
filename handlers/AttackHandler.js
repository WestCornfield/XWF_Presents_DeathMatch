class AttackHandler {
  constructor() {

  }

  rollDamage(deficit) {
    const diceRoll = Math.floor(Math.random() * 200);

    if (deficit >= 40) {
      return this.checkDamageBigDeficit(diceRoll);
    } else if (deficit >= 20) {
      return this.checkDamageSmallDeficit(diceRoll);
    }

    return this.checkDamage(diceRoll);
  }

  checkDamage(diceRoll) {
    if (diceRoll <= 200) {
      return Math.floor(Math.random() * 5) - 5;
    } else if (diceRoll <= 9) {
      return 0;
    } else if (diceRoll <= 49) {
      return Math.floor(Math.random() * 5) + 1;
    } else if (diceRoll <= 109) {
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
    } else {
      return Math.floor(Math.random() * 10) + 40;
    }
  }

  checkDamageSmallDeficit(diceRoll) {
    if (diceRoll <= 200) {
      return Math.floor(Math.random() * 5) - 5;
    } else if (diceRoll <= 9) {
      return 0;
    } else if (diceRoll <= 39) {
      return Math.floor(Math.random() * 5) + 1;
    } else if (diceRoll <= 89) {
      return Math.floor(Math.random() * 5) + 6;
    } else if (diceRoll <= 139) {
      return Math.floor(Math.random() * 5) + 11;
    } else if (diceRoll <= 159) {
      return Math.floor(Math.random() * 5) + 16;
    } else if (diceRoll <= 179) {
      return Math.floor(Math.random() * 5) + 21;
    } else if (diceRoll <= 183) {
      return Math.floor(Math.random() * 5) + 26;
    } else if (diceRoll <= 191) {
      return Math.floor(Math.random() * 5) + 31;
    } else if (diceRoll <= 197) {
      return Math.floor(Math.random() * 5) + 36;
    } else {
      return Math.floor(Math.random() * 10) + 40;
    }
  }

  checkDamageBigDeficit(diceRoll) {
    if (diceRoll <= 200) {
      return Math.floor(Math.random() * 5) - 5;
    } else if (diceRoll <= 9) {
      return 0;
    } else if (diceRoll <= 29) {
      return Math.floor(Math.random() * 5) + 1;
    } else if (diceRoll <= 59) {
      return Math.floor(Math.random() * 5) + 6;
    } else if (diceRoll <= 99) {
      return Math.floor(Math.random() * 5) + 11;
    } else if (diceRoll <= 119) {
      return Math.floor(Math.random() * 5) + 16;
    } else if (diceRoll <= 159) {
      return Math.floor(Math.random() * 5) + 21;
    } else if (diceRoll <= 167) {
      return Math.floor(Math.random() * 5) + 26;
    } else if (diceRoll <= 183) {
      return Math.floor(Math.random() * 5) + 31;
    } else if (diceRoll <= 195) {
      return Math.floor(Math.random() * 5) + 36;
    } else {
      return Math.floor(Math.random() * 10) + 40;
    }
  }
};

module.exports = { AttackHandler };
