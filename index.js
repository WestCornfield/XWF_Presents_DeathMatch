const { Client, Intents, MessageAttachment, MessageEmbed } = require('discord.js');

console.log('XWF Deathmatch running');

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
    value: username?.username
  }));

  roles.forEach((name, id) => roleArr.push({
    key: id,
    value: name?.name
  }));

  const namesArr = userArr.concat(roleArr);

  console.log('namesArr');
  console.log(namesArr);

  if (namesArr.length === 0) {
    return ["Jobber1", "Jobber2"];
  } else if (namesArr.length === 1) {
    return [namesArr[0].value, "Jobber"];
  }

  return [namesArr[0].value, namesArr[1].value];
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

const generateFailure = (newMsg, attackerName, damage, sentences) => {
  const selfDamage = -1*damage;

  const newSentence = attackerName+ " trips mid-move and deals "+ selfDamage + " to themselves!";

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'));  

  newMsg.edit({ embeds: [newEmbed] });

  return sentences;
}

const generateAttack = (newMsg, attackerName, victimName, damage, sentences) => {
  const weapon = selectWeapon(damage);

  const newSentence = attackerName + " hits "+ victimName + " with a "+ weapon +" for "+damage+" damage!";

  const newSentences = updateSentences(newSentence, sentences);

  const file = new MessageAttachment('./assets/xwf_logo.png');

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'));  

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

  console.log(sentences);
  
  return sentences;
}

const fight = async (newMsg, combatantOne, combatantTwo) => {
  let firstSentence = combatantOne.name+" and "+combatantTwo.name+" meet in the center of the ring!";

  let sentences = [firstSentence];
  let playerOnesTurn = decideTurn();

  const firstTurnPlayer = (playerOnesTurn) ? combatantOne.name : combatantTwo.name;

  sentences.push("The first attack goes to " + firstTurnPlayer);

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(sentences.join('\r\n'));  

  newMsg.edit({ embeds: [newEmbed] });

  while (combatantOne.hp > 0 && combatantTwo.hp > 0) {
    await delay(1000);

    let damage = Math.floor(Math.random() * 40) - 2;

    if (playerOnesTurn) {
      if (damage >= 0){
        sentences = generateAttack(newMsg, combatantOne.name, combatantTwo.name, damage, sentences);
        combatantTwo.hp -= damage;
      } else {
        sentences = generateFailure(newMsg, combatantOne.name, damage, sentences);
        combatantOne.hp += damage;
      }
    } else {
      if (damage >= 0){
        sentences = generateAttack(newMsg, combatantTwo.name, combatantOne.name, damage, sentences);
        combatantOne.hp -= damage;
      } else {
        sentences = generateFailure(newMsg, combatantTwo.name, damage, sentences);
        combatantTwo.hp += damage;
      }
    }

    console.log('combatantOne.hp = ' + combatantOne.hp)
    console.log('combatantTwo.hp = ' + combatantTwo.hp)

    playerOnesTurn = !playerOnesTurn;
  }

  const winner = (combatantOne.hp <= 0) ? combatantTwo.name : combatantOne.name

  generateWinnerStatement(newMsg, sentences, winner);
}

const generateWinnerStatement = (newMsg, sentences, winner) => {
  const newSentence = "The winner is " + winner + "!";

  const newSentences = updateSentences(newSentence, sentences);

  const newEmbed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(newMsg.embeds[0].title)
    .setDescription(newSentences.join('\r\n'));  

  newMsg.edit({ embeds: [newEmbed] });
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const initiateFight = async (msg, combatants) => {
  const file = new MessageAttachment('./assets/xwf_logo.png');

  msg.reply({ files: [file] });

  await delay(1000);

  let combatantOne = {
    name: combatants[0],
    hp: 100
  };

  let combatantTwo = {
    name: combatants[1],
    hp: 100
  };

  const embed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle('DEATHMATCH: '+combatants[0]+' vs '+combatants[1])
    .setDescription(combatants[0]+" and "+combatants[1]+" meet in the center of the ring!");

  msg.reply({ embeds: [embed] }).then(newMsg => {
    fight(newMsg, combatantOne, combatantTwo);
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", msg => {
  console.log(msg.content);
  
  const content = msg.content;
  const mentions = msg.mentions;

  if (content.includes("--xwf-deathmatch")) {
    if (content.includes("--help")) {
      msg.reply("THE ACTION NEVER SLOWS DOWN! SELECT YOUR COMBATANTS AND SEND THEM TO THE RING!")
    } else {
      const combatants = generateCombatants(mentions);

      console.log('mentions');
      console.log(mentions);

      initiateFight(msg, combatants);
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