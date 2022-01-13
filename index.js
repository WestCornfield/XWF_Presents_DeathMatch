const { Attachment, Client, Intents, MessageAttachment, MessageEmbed,MessagePayload, TextChannel } = require('discord.js');
const { AttackHandler } = require('./handlers/AttackHandler');
const { WeaponHandler } = require('./handlers/WeaponHandler');
const { FightScreenGenerator } = require('./generators/FightScreenGenerator');

const http = require('http');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const generateCombatants = (mentions, author) => {
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
};

const buildEmbed = (color, sentences, combatants) => {
  return new MessageEmbed()
    .setColor(color)
    .setTitle('DEATHMATCH: __'+combatants[0].name+'__ vs __'+combatants[1].name+'__')
    .setDescription(sentences.join('\r\n'))
    .addFields(
      { name: combatants[0].name, value: combatants[0].hp + "/100", inline:true },
      { name: combatants[1].name, value: combatants[1].hp + "/100", inline:true }
    );
}

const generateFailure = (newMsg, playerOnesTurn, damage, sentences, combatants) => {
  const selfDamage = -1*damage;

  const attacker = (playerOnesTurn) ? combatants[0] : combatants[1];

  const newSentence = "💣 __"+attacker.name+"__ trips mid-move and deals __"+ selfDamage + "__ to themselves!";

  attacker.hp = (attacker.hp <= selfDamage) ? 0 : (attacker.hp - selfDamage);

  const newSentences = updateSentences(newSentence, sentences);

  const embed = buildEmbed(0x000000, newSentences, combatants);
  newMsg.edit({ embeds: [embed] });

  return sentences;
}

const generateAttack = (newMsg, playerOnesTurn, damage, sentences, combatants) => {
  const weaponHandler = new WeaponHandler();

  const attacker = (playerOnesTurn) ? combatants[0] : combatants[1];

  const victim = (playerOnesTurn) ? combatants[1] : combatants[0];

  const direction = (playerOnesTurn) ? "👉" : "👈";

  const color = (playerOnesTurn) ? 0x00ff00 : 0xff0000;

  const newSentence = weaponHandler.generateAttackText(attacker, victim, damage, direction);

  victim.hp = (victim.hp <= damage) ? 0 : (victim.hp - damage);

  const newSentences = updateSentences(newSentence, sentences);

  const file = new MessageAttachment('./assets/xwf_logo.png');

  const embed = buildEmbed(color, newSentences, combatants);
  newMsg.edit({ embeds: [embed] });

  return newSentences;
}

const updateSentences = (newSentence, sentences) => {
  sentences.push(newSentence);

  if (sentences.length > 3) {
    sentences[0] = sentences[1];
    sentences[1] = sentences[2];
    sentences[2] = sentences[3];
    sentences.length = 3;
  }

  return sentences;
}

const fight = async (newMsg, combatants) => {
  let firstSentence = "__"+combatants[0].name+"__ and __"+combatants[1].name+"__ meet in the center of the ring!";

  let sentences = [firstSentence];
  let playerOnesTurn = decideTurn();

  const firstTurnPlayer = (playerOnesTurn) ? combatants[0] : combatants[1];

  sentences.push("The first attack goes to __" + firstTurnPlayer.name + "__");

  const embed = buildEmbed(0x0099ff, sentences, combatants);
  newMsg.edit({ embeds: [embed] });

  while (combatants[0].hp > 0 && combatants[1].hp > 0) {
    await delay(2000);

    let attackHandler = new AttackHandler();

    let deficit = (playerOnesTurn) ? combatants[1].hp - combatants[0].hp : combatants[0].hp - combatants[1].hp;

    let damage = attackHandler.rollDamage(deficit);

    sentences = (damage >= 0) ? generateAttack(newMsg, playerOnesTurn, damage, sentences, combatants) : generateFailure(newMsg, playerOnesTurn, damage, sentences, combatants);

    playerOnesTurn = !playerOnesTurn;
  }

  const winner = (combatants[0].hp <= 0) ? combatants[1] : combatants[0];

  const loser = (combatants[0].hp <= 0) ? combatants[0] : combatants[1];

  generateWinnerStatement(newMsg, sentences, combatants, winner);

  shenanigans(newMsg, sentences, combatants, winner, loser);
}

const generateReason = () => {
  const outcome = Math.floor(Math.random() * 4);

  if (outcome === 0) {
    return "being smelly";
  } else if (outcome === 1) {
    return "poor sportsmanship";
  } else if (outcome === 2) {
    return "no good reason";
  } else if (outcome === 3) {
    return "attire that violates Deathmatch regulations";
  }
}

const dustyFinish = async (newMsg, sentences, combatants, winner, loser) => {
  const surpriseEnding = [
    "...But What's This?",
    "The Official Is Disqualifying __"+winner.name+"__ for "+ generateReason() +"!",
    "The actual winner is __"+loser.name+"__!"
  ]

  for (const sentence of surpriseEnding) {
    await delay(2000);
    const newSentences = updateSentences(sentence, sentences);
    const embed = buildEmbed(0x800080, newSentences, combatants);
    newMsg.edit({ embeds: [embed] });
  }
}

const oneLastChance = async (newMsg, sentences, combatants, winner, loser) => {
    const surpriseEnding = [
    "...But What's This?",
    loser.name + " has One Last Chance...",
  ];

  for (const sentence of surpriseEnding) {
    await delay(2000);
    sentences = updateSentences(sentence, sentences);
    const embed = buildEmbed(0x800080, sentences, combatants);
    newMsg.edit({ embeds: [embed] });
  }

  await delay(3000);

  let damage = Math.floor(Math.random() * 40);

  sentences = generateAttack(newMsg, (winner === combatants[1]), damage, sentences, combatants);

  let lastSentence = "";

  if (winner.hp <= 0) {
    lastSentence = "INCREDIBLE! BOTH COMPETITORS ARE DOWN! THE MATCH IS A DRAW!";
  } else {
    lastSentence = "BUT IT'S NOT ENOUGH! The Winner is still __"+winner.name+"__";
  }

  sentences = updateSentences(lastSentence, sentences);
  const embed = buildEmbed(0xffffff, sentences, combatants);
  newMsg.edit({ embeds: [embed] });
}

const shenanigans = (newMsg, sentences, combatants, winner, loser) => {
  const outcome = Math.floor(Math.random() * 100);

  if (outcome <= 1) {
    dustyFinish(newMsg, sentences, combatants, winner, loser);
  } else if (outcome <= 10) {
    oneLastChance(newMsg, sentences, combatants, winner, loser);
  }
}

const generateWinnerStatement = (newMsg, sentences, combatants, winner) => {
  const newSentence = "The winner is __" + winner.name + "__!";

  const newSentences = updateSentences(newSentence, sentences);

  const embed = buildEmbed(0xffffff, newSentences, combatants);
  newMsg.edit({ embeds: [embed] });
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const initiateFight = async (textChannel, combatants) => {
  await delay(2000);

  const sentences = ["__"+combatants[0].name+"__ and __"+combatants[1].name+"__ meet in the center of the ring!"]

  const embed = buildEmbed(0x0099ff, sentences, combatants);

  textChannel.send({ embeds: [embed] }).then(newMsg => {
    fight(newMsg, combatants);
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", async msg => {
  const textChannel = msg.channel;

  const content = msg.content;
  const mentions = msg.mentions;
  const author = msg.author;

  if (content.includes("--xwf-deathmatch")) {
    if (content.includes("--help")) {
      textChannel.send("THE ACTION NEVER SLOWS DOWN! SELECT YOUR COMBATANTS AND SEND THEM TO THE RING!")
    } else {
      const combatants = generateCombatants(mentions, author);

      const fightScreenGenerator = new FightScreenGenerator();
      const attachment = await fightScreenGenerator.generateFightScreen();

      textChannel.send({ files: [attachment] });

      initiateFight(textChannel, combatants);
    }
  }
});

client.login(process.env.TOKEN).catch(err => {
  console.error('');
  console.error(chalk.redBright("Couldn't log into Discord. Wrong bot token?"));
  console.error('');
  console.error(err);
  process.exit();
});

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end(); }).listen(8080);
