class VinnieHandler {
  constructor() {

  }

  generateVinnieCommentary() {
    if (damage > 40) {
      const vinnieCommentary = generateVinnieism();

      return "🎙️ Vinnie Lane: "+vinnieCommentary
    }
  }

  generateVinnieism() {
    let vinnieism = Math.floor(Math.random() * 6);

    let insults = ["Bodaceous!", "Pugnacious!", "Tubular!", "Gnarly!", "Whoa!", "Most Triumphant!"];

    return insults[insult];
  }
};

module.exports = { VinnieHandler };
