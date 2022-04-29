const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

class FightScreenGenerator {
  constructor() {

  }

  async generateFightScreen(combatants) {
    const canvas = createCanvas(300, 320);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('./assets/xwf_deathmatch_screen_v2.png');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatarOne = await loadImage(combatants[0].image);
    const avatarTwo = await loadImage(combatants[1].image);

    ctx.drawImage(avatarOne, 25, 150, 100, 100);
    ctx.drawImage(avatarTwo, 175, 150, 100, 100);

    const name1 = this.shortenNameIfNecessary(combatants[0].name);
    const name2 = this.shortenNameIfNecessary(combatants[1].name);

    const xPoses = this.retrieveXPoses(name1, name2);

    ctx.fillText(name1, xPoses.xPos1, 276);
    ctx.fillText(name2, xPoses.xPos2, 276);

    const attachment = new MessageAttachment(canvas.toBuffer());

    return attachment;
  }

  retrieveXPoses(name1, name2) {
    const xPoses1 = [78, 75, 72, 69, 66, 63, 60, 57, 54, 51, 48, 45, 42, 39, 36, 33, 30];
    const xPoses2 = [227, 225, 222, 220, 217, 215, 212, 210, 207, 205, 202, 200, 197, 195, 192, 190, 188];

    return {
      xPos1: xPoses1[name1.length],
      xPos2: xPoses2[name2.length]
    };
  }

  shortenNameIfNecessary(name) {
    return (name.length > 16) ? name.substring(0,16) : name;
  }
};

module.exports = { FightScreenGenerator };
