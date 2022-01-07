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
    image: username.displayAvatarURL({ format: 'jpg' })
  }));

  roles.forEach((name, id) => roleArr.push({
    key: id,
    name: name?.name,
    image: './assets/locked_character.jpeg'
  }));

  jobbersArr = [
    {
      key: '1',
      name: "Jobber1",
      image: "./assets/locked_character.jpeg"
    },
    {
      key: '2',
      name: "Jobber2",
      image: "./assets/locked_character.jpeg"
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

const generateFailure = (newMsg, attackerName, damage, sentences, combatantOne, combatantTwo) => {
  const selfDamage = -1*damage;

  const newSentence = "__"+attackerName+"__ trips mid-move and deals __"+ selfDamage + "__ to themselves!";

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'))
    .addFields(
      { name: combatantOne.name, value: combatantOne.hp + "/100", inline:true },
      { name: combatantTwo.name, value: combatantTwo.hp + "/100", inline:true }
    );

  newMsg.edit({ embeds: [newEmbed] });

  return sentences;
}

const generateAttack = (newMsg, attackerName, victimName, damage, sentences, combatantOne, combatantTwo) => {
  const weapon = selectWeapon(damage);

  const newSentence = "__"+attackerName + "__ hits __"+ victimName + "__ with a "+ weapon +" for __"+damage+"__ damage!";

  const newSentences = updateSentences(newSentence, sentences);

  const file = new MessageAttachment('./assets/xwf_logo.png');

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'))
    .addFields(
      { name: combatantOne.name, value: combatantOne.hp + "/100", inline:true },
      { name: combatantTwo.name, value: combatantTwo.hp + "/100", inline:true }
    );

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

const fight = async (newMsg, combatantOne, combatantTwo) => {
  let firstSentence = "__"+combatantOne.name+"__ and __"+combatantTwo.name+"__ meet in the center of the ring!";

  let sentences = [firstSentence];
  let playerOnesTurn = decideTurn();

  const firstTurnPlayer = (playerOnesTurn) ? combatantOne.name : combatantTwo.name;

  sentences.push("The first attack goes to __" + firstTurnPlayer + "__");

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(sentences.join('\r\n'))
    .addFields(
      { name: combatantOne.name, value: combatantOne.hp + "/100", inline:true },
      { name: combatantTwo.name, value: combatantTwo.hp + "/100", inline:true }
    );

  newMsg.edit({ embeds: [newEmbed] });

  while (combatantOne.hp > 0 && combatantTwo.hp > 0) {
    await delay(2000);

    let damage = Math.floor(Math.random() * 40) - 2;

    if (playerOnesTurn) {
      if (damage >= 0){
        combatantTwo.hp -= damage;
        sentences = generateAttack(newMsg, combatantOne.name, combatantTwo.name, damage, sentences, combatantOne, combatantTwo);
      } else {
        combatantOne.hp += damage;
        sentences = generateFailure(newMsg, combatantOne.name, damage, sentences, combatantOne, combatantTwo);
      }
    } else {
      if (damage >= 0){
        combatantOne.hp -= damage;
        sentences = generateAttack(newMsg, combatantTwo.name, combatantOne.name, damage, sentences, combatantOne, combatantTwo);

      } else {
        combatantTwo.hp += damage;
        sentences = generateFailure(newMsg, combatantTwo.name, damage, sentences, combatantOne, combatantTwo);
      }
    }

    playerOnesTurn = !playerOnesTurn;
  }

  const winner = (combatantOne.hp <= 0) ? combatantTwo.name : combatantOne.name

  generateWinnerStatement(newMsg, sentences, combatantOne, combatantTwo, winner);
}

const generateWinnerStatement = (newMsg, sentences, combatantOne, combatantTwo, winner) => {
  const newSentence = "The winner is __" + winner + "__!";

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'))
    .addFields(
      { name: combatantOne.name, value: combatantOne.hp + "/100", inline:true },
      { name: combatantTwo.name, value: combatantTwo.hp + "/100", inline:true }
    );

  newMsg.edit({ embeds: [newEmbed] });
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const initiateFight = async (textChannel, combatants) => {
  await delay(2000);

  let combatantOne = {
    name: combatants[0].name,
    hp: 100
  };

  let combatantTwo = {
    name: combatants[1].name,
    hp: 100
  };

  console.log(combatantOne);
  console.log(combatantTwo);

  const embed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle('DEATHMATCH: __'+combatantOne.name+'__ vs __'+combatantTwo.name+'__')
    .setDescription("__"+combatantOne.name+"__ and __"+combatantTwo.name+"__ meet in the center of the ring!")
    .addFields(
      { name: combatantOne.name, value: "100/100", inline:true },
      { name: combatantTwo.name, value: "100/100", inline:true }
    );

  textChannel.send({ embeds: [embed] }).then(newMsg => {
    fight(newMsg, combatantOne, combatantTwo);
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
