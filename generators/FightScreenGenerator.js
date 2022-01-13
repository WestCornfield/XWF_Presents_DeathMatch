const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

class FightScreenGenerator {
  constructor() {

  }

  async generateFightScreen(combatants) {
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
}

module.exports = { FightScreenGenerator };
