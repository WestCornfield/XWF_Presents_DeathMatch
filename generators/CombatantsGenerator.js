class CombatantsGenerator {
  constructor() {

  }

  generateCombatants(mentions, author) {
    const users = mentions.users;
    const roles = mentions.roles;

    const userArr = [];
    const roleArr = [];

    users.forEach((username, id) => userArr.push({
      key: id,
      name: username?.username,
      image: username.displayAvatarURL({ format: 'jpg' }),
      hp: 100
    }));

    roles.forEach((name, id) => roleArr.push({
      key: id,
      name: name?.name,
      image: './assets/locked_character.jpeg',
      hp: 100
    }));

    const authorArr = [{
      key: author.id,
      name: author.username,
      image: author.displayAvatarURL({ format: 'jpg' }),
      hp: 100
    }];

    jobbersArr = [
      {
        key: '1',
        name: "Jobber1",
        image: "./assets/locked_character.jpeg",
        hp: 100
      }
    ];

    const combatantsArr = userArr.concat(roleArr).concat(authorArr).concat(jobbersArr);

    return [combatantsArr[0], combatantsArr[1]];
  }
}

module.exports = { CombatantsGenerator };
