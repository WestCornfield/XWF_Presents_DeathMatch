class VinnieHandler {
  constructor() {

  }

  generateVinnieCommentary() {
    const vinnieCommentary = this.generateVinnieism();

    return "🎙️ Vinnie Lane: "+vinnieCommentary
  }

  generateVinnieism() {
    let index = Math.floor(Math.random() * 6);

    let vinnieisms = ["Bodaceous!", "Pugnacious!", "Tubular!", "Gnarly!", "Whoa!", "Most Triumphant!"];

    return vinnieisms[index];
  }
};

module.exports = { VinnieHandler };
