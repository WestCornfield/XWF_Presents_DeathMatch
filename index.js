const { Client, Intents } = require('discord.js');

console.log('XWF Deathmatch running');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const generateCombatants = (msgContent) => {
  const msgArr = msgContent.split(" ");

  if (msgArr.length === 1) {
    return ["Jobber1", "Jobber2"];
  } else if (msgArr.length === 2) {
    return [msgArr[1], "Jobber"];
  }

  return [msgArr[1], msgArr[2]];
};

const fightText = (msg, combatantOne, combatantTwo) => {
    msg.reply(combatants[0]+" and "+combatants[1]+" meet in the center of the ring!").then(newMessage => {
      newMessage.edit("The bell rings!");
      newMessage.edit(combatants[0]+" hits "+combatants[1]+" with a right hook for 100 damage!")
      newMessage.edit(combatants[1]+" goes down!")
      newMessage.edit("The winner is "+combatants[0]);
    });
}

const decideTurn = () => {
  const outcome = Math.floor(Math.random() * 100);

  return (outcome > 50);
}

const startFight = (msg, combatants) => {
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
    newMessage = newMsg;
  })

  let playerOnesTurn = decideTurn();

  while (combatantOne.hp > 0 && combatantTwo.hp > 0) {
    console.log('combatantOne.hp = ' + combatantOne.hp)
    console.log('combatantTwo.hp = ' + combatantTwo.hp)

    let damage = Math.floor(Math.random() * 30);

    if (playerOnesTurn) {
      comabatantTwo.health -= damage;
      newMessage.edit(combatants[0]+" hits "+combatants[1]+" with a right hook for " + damage + " damage!");
    } else {
      comabatantOne.health -= damage;
      newMessage.edit(combatants[0]+" hits "+combatants[1]+" with a right hook for " + damage + " damage!");
    }

    playerOnesTurn = !playerOnesTurn;
  }

  const winner = (combatantOne.hp <= 0) ? combatantTwo.name : combatantOne.name

  msg.edit("The winner is " + winner + "!");
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

      startFight(msg, combatants);
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