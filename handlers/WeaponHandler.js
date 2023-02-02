class WeaponHandler {
  constructor() {

  }

  generateAttackText(attacker, victim, damage, direction) {
    if (damage === 0) {
      const meanName = this.generateInsult();

      return direction+" __"+attacker.name + "__ calls __"+ victim.name + "__ "+ meanName +" for __0__ physical damage... but indescribable emotional damage!";
    } else if (damage <= 5) {
      return direction+" __"+attacker.name + "__ punches __"+ victim.name + "__ in the face for __"+damage+"__ damage!";
    } else if (damage <= 10) {
      return direction+" __"+attacker.name + "__ delivers a knife edge chop to __"+ victim.name + "__ for __"+damage+"__ damage!";
    } else if (damage <= 15) {
      return direction+" __"+attacker.name + "__ kicks __"+ victim.name + "__ in the head for __"+damage+"__ damage!";
    } else if (damage <= 20) {
      return direction+" __"+attacker.name + "__ hits __"+ victim.name + "__ with a shovel for __"+damage+"__ damage!";
    } else if (damage <= 25) {
      return direction+" __"+attacker.name + "__ pulls out a gun and shoots __"+ victim.name + "__ for __"+damage+"__ damage!"
    } else if (damage <= 30) {
      return direction+" __"+attacker.name + "__ calls upon the elemental power of lightning! A bolt strikes __"+ victim.name + "__ for __"+damage+"__ damage!"
    } else if (damage <= 35) {
      const car = this.generateCar();

      return direction+" __"+attacker.name + "__ runs over __"+ victim.name + "__ in "+ car +" for __"+damage+"__ damage!";
    } else if (damage <= 40) {
      return direction+" __"+attacker.name + "__ lights the fuse on a bomb and tosses it at __"+ victim.name + "__ ! IT EXPLODES... dealing __"+damage+"__ damage!";
    } else {
      return this.generateSuperMove(direction, attacker, victim, damage);
    }
  }

  generateSuperMove(direction, attacker, victim, damage) {
    let outcome = Math.floor(Math.random() * 4);

    let outcomes = [direction+" __"+attacker.name + "__ sticks out one finger into __"+ victim.name + "__'s chest... FINGERPOKE OF DOOM! __"+damage+"__ damage!",
    direction+" __"+attacker.name + "__'s fist shakes, enraged at __" + victim.name +"__! 'I TOLD YOU NOT TO TOUCH IT!' WHAM! ARTHUR PUNCH! __"+damage+"__ damage!",
    direction+" __"+attacker.name + "__ SLAMS __"+ victim.name + "__ on the ring apron! THAT'S THE HARDEST PART OF THE RING! __"+damage+"__ damage!",
    direction+" __"+attacker.name + "__ makes __"+ victim.name + "__ watch ECW December to Dismember 2006. Twice. __"+damage+"__ damage!"                
    ];

    return outcomes[outcome];
  }

  generateCar() {
    let car = Math.floor(Math.random() * 5);

    let cars = ["a Toyota Prius", "a Honda Civic", "a Dodge Ram", "The Car That Ran Down Noah Jackson", "The Mystery Machine"];

    return cars[car];
  }

  generateInsult() {
    let insult = Math.floor(Math.random() * 6);

    let insults = ["a Spoony Bard", "a No Good Bastard", "a Stinky Cheater", "an Underwhelming Writer", "a Stupid Idiot", "a Part-Timer"];

    return insults[insult];
  }
}

module.exports = { WeaponHandler };
