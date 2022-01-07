const { Attachment, Client, Intents, MessageAttachment, MessageEmbed,MessagePayload, TextChannel } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const generateCombatants = (mentions) => {
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

  jobbersArr = [
    {
      key: '1',
      name: "Jobber1",
      image: "./assets/locked_character.jpeg",
      hp: 100
    },
    {
      key: '2',
      name: "Jobber2",
      image: "./assets/locked_character.jpeg",
      hp: 100
    }
  ];

  const combatantsArr = userArr.concat(roleArr).concat(jobbersArr);

  return [combatantsArr[0], combatantsArr[1]];
};

const selectWeapon = (damage) => {
  if (damage > 35) {
    return "BOMB"
  } else if (damage > 30) {
    return "Honda Civic"
  } else if (damage > 25) {
    return "Lightning Strike"
  } else if (damage > 20) {
    return "Bullet... from a Gun"
  } else if (damage > 15) {
    return "Shovel"
  } else if (damage > 10) {
    return "Kick"
  } else if (damage > 5) {
    return "Chop"
  } else if (damage > 0) {
    return "Punch"
  } else if (damage === 0) {
    return "Devastating Insult"
  }
}

const buildEmbed = (sentences, combatants) => {
  return new MessageEmbed()
    .setColor(0x0099ff)
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

  const newSentence = "__"+attacker.name+"__ trips mid-move and deals __"+ selfDamage + "__ to themselves!";

  attacker.hp -= selfDamage;

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = buildEmbed(newSentences, combatants);
  newMsg.edit({ embeds: [newEmbed] });

  return sentences;
}

const generateAttack = (newMsg, playerOnesTurn, damage, sentences, combatants) => {
  const weapon = selectWeapon(damage);

  const attacker = (playerOnesTurn) ? combatants[0] : combatants[1];

  const victim = (playerOnesTurn) ? combatants[1] : combatants[0];

  const newSentence = "__"+attacker.name + "__ hits __"+ victim.name + "__ with a "+ weapon +" for __"+damage+"__ damage!";

  victim.hp -= damage;

  const newSentences = updateSentences(newSentence, sentences);

  const file = new MessageAttachment('./assets/xwf_logo.png');

  const newEmbed = buildEmbed(newSentences, combatants);
  newMsg.edit({ embeds: [newEmbed] });

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

  const newEmbed = buildEmbed(sentences, combatants);
  newMsg.edit({ embeds: [newEmbed] });

  while (combatants[0].hp > 0 && combatants[1].hp > 0) {
    await delay(2000);

    let damage = Math.floor(Math.random() * 40) - 2;

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
    "The Official Is Disqualifying "+winner.name+" for "+ generateReason() +"!",
    "The actual winner is "+loser.name+"!"
  ]

  for (const sentence of surpriseEnding) {
    await delay(2000);
    const newSentences = updateSentences(sentence, sentences);
    const newEmbed = buildEmbed(newSentences, combatants);
    newMsg.edit({ embeds: [newEmbed] });
  }
}

const oneLastChance = async (newMsg, sentences, combatants, winner, loser) => {
  console.log("inside one last chance");
    const surpriseEnding = [
    "...But What's This?",
    loser.name + " has One Last Chance...",
  ];

  for (const sentence of surpriseEnding) {
    await delay(2000);
    console.log(sentence);
    sentences = updateSentences(sentence, sentences);
    console.log(sentences);
    const newEmbed = buildEmbed(sentences, combatants);
    newMsg.edit({ embeds: [newEmbed] });
  }

  await delay(3000);

  let damage = Math.floor(Math.random() * 40);

  sentences = generateAttack(newMsg, (winner === combatants[1]), damage, sentences, combatants);

  let lastSentence = "";

  if (winner.hp <= 0) {
    lastSentence = "INCREDIBLE! BOTH COMPETITORS ARE DOWN! THE MATCH IS A DRAW!";
  } else {
    lastSentence = "BUT IT'S NOT ENOUGH! The Winner is still "+winner.name;
  }

  sentences = updateSentences(lastSentence, sentences);
  const newEmbed = buildEmbed(sentences, combatants);
  newMsg.edit({ embeds: [newEmbed] });
}

const shenanigans = (newMsg, sentences, combatants, winner, loser) => {
  const outcome = Math.floor(Math.random() * 100);

  if (outcome < 100) {
    dustyFinish(newMsg, sentences, combatants, winner, loser);
  } else {
    oneLastChance(newMsg, sentences, combatants, winner, loser)
  }
}

const generateWinnerStatement = (newMsg, sentences, combatants, winner) => {
  const newSentence = "The winner is __" + winner.name + "__!";

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = buildEmbed(newSentences, combatants);
  newMsg.edit({ embeds: [newEmbed] });
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const initiateFight = async (textChannel, combatants) => {
  await delay(2000);

  const sentences = ["__"+combatants[0].name+"__ and __"+combatants[1].name+"__ meet in the center of the ring!"]

  const embed = buildEmbed(sentences, combatants);

  textChannel.send({ embeds: [embed] }).then(newMsg => {
    fight(newMsg, combatants);
  });
};

const generateFightScreen = async (combatants) => {
  const canvas = createCanvas(300, 320);
  const ctx = canvas.getContext('2d');

  const background = await loadImage('./assets/xwf_deathmatch_screen.png');

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatarOne = await loadImage(combatants[0].image);
  const avatarTwo = await loadImage(combatants[1].image);

  ctx.drawImage(avatarOne, 25, 150, 100, 100);
  ctx.drawImage(avatarTwo, 175, 150, 100, 100);

  const attachment = new MessageAttachment(canvas.toBuffer());

  return attachment;
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", async msg => {
  const textChannel = msg.channel;

  const content = msg.content;
  const mentions = msg.mentions;

  if (content.includes("--xwf-deathmatch")) {
    if (content.includes("--help")) {
      textChannel.send("THE ACTION NEVER SLOWS DOWN! SELECT YOUR COMBATANTS AND SEND THEM TO THE RING!")
    } else {
      const combatants = generateCombatants(mentions);

      const attachment = await generateFightScreen(combatants);

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
