const { Client, Intents } = require('discord.js');

console.log('XWF Deathmatch running');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const generateCombatants = (msgContent) => {
  const msgArr = msgContent.split(" ");

  if (msgArr.length === 1) {
    return ["Jobber1", "Jobber2"];
  } else if (msgArr.length === 2) {
    return [msgArr[1], "Jobber"];
  }

  return [msgArr[1], msgArr[2]];
};

const selectWeapon = (damage) => {
  if (damage > 35) {
    return "BOMB!"
  } else if (damage > 30) {
    return "Honda Civic"
  } else if (damage > 25) {
    return "Lightning Strike"
  } else if (damage > 20) {
    return "Bullet from a Gun"
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

  const newSentence = attackerName+ " trips mid-move and deals "+ selfDamage + "to themselves!";

  const newSentences = updateSentences(newSentence, sentences);

  newMsg.edit(newSentences.join('\r\n'));

  return sentences;
}

const generateAttack = (newMsg, attackerName, victimName, damage, sentences) => {
  const weapon = selectWeapon(damage);

  const newSentence = attackerName + " hits "+ victimName + " with a "+ weapon +" for "+damage+" damage!";

  const newSentences = updateSentences(newSentence, sentences);  

  newMsg.edit(newSentences.join('\r\n'));

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

  newMsg.edit(sentences.join('\r\n'));

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

  newMsg.edit(newSentences.join('\r\n'));
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const initiateFight = (msg, combatants) => {
  let combatantOne = {
    name: combatants[0],
    hp: 100
  };

  let combatantTwo = {
    name: combatants[1],
    hp: 100
  };

  let newMessage;

  msg.reply(combatants[0]+" and "+combatants[1]+" meet in the center of the ring!").then(newMsg => {
    fight(newMsg, combatantOne, combatantTwo);
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", msg => {
  console.log(msg.content);
  
  const content = msg.content;

  if (content.includes("--xwf-deathmatch")) {
    if (content.includes("--help")) {
      msg.reply("THE ACTION NEVER SLOWS DOWN! SELECT YOUR COMBATANTS AND SEND THEM TO THE RING!")
    } else {
      const combatants = generateCombatants(content);

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