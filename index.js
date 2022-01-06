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

const fight = async (newMsg, combatantOne, combatantTwo) => {
  let playerOnesTurn = decideTurn();

  const firstTurnPlayer = (playerOnesTurn) ? combatantOne.name : combatantTwo.name;

  newMsg.edit("The first attack goes to " + firstTurnPlayer);

  while (combatantOne.hp > 0 && combatantTwo.hp > 0) {
    await delay(1000);

    let damage = Math.floor(Math.random() * 30);

    if (playerOnesTurn) {
      newMsg.edit(combatantOne.name +" hits "+combatantTwo.name+" with a right hook for " + damage + " damage!");
      combatantTwo.hp -= damage;
    } else {
      newMsg.edit(combatantTwo.name+" hits "+combatantOne.name+" with a right hook for " + damage + " damage!");
      combatantOne.hp -= damage;
    }

    console.log('combatantOne.hp = ' + combatantOne.hp)
    console.log('combatantTwo.hp = ' + combatantTwo.hp)

    playerOnesTurn = !playerOnesTurn;
  }

  const winner = (combatantOne.hp <= 0) ? combatantTwo.name : combatantOne.name

  newMsg.edit("The winner is " + winner + "!");
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