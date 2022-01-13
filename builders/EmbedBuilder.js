const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

class EmbedBuilder {
  constructor() {

  }

  buildEmbed(color, sentences, combatants) {
    return new MessageEmbed()
      .setColor(color)
      .setTitle('DEATHMATCH: __'+combatants[0].name+'__ vs __'+combatants[1].name+'__')
      .setDescription(sentences.join('\r\n'))
      .addFields(
        { name: combatants[0].name, value: combatants[0].hp + "/100", inline:true },
        { name: combatants[1].name, value: combatants[1].hp + "/100", inline:true }
      );
  }
}

module.exports = { FightScreenGenerator };
