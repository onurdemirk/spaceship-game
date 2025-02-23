export class GameSounds {
  constructor() {
    this.sounds = {
      hit: new Audio("./sounds/hit.mp3"),
      miss: new Audio("./sounds/miss.mp3"),
      error: new Audio("./sounds/error.mp3"),
      hal: new Audio("./sounds/hal9000.mp3"),
      cantdo: new Audio("./sounds/cantdo.mp3"),
      stay: new Audio("./sounds/stay.mp3"),
    };

    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.4;
      sound.preload = "auto";
    });

    this.sounds.hal.volume = 0.2;
    this.sounds.hal.loop = true;

    this.sounds.stay.volume = 0.3;

    this.sounds.hit.volume = 0.2;
    this.sounds.hit.loop = false;
  }

  play(soundName) {
    const sound = this.sounds[soundName];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.log("Sound error:", error);
    });
  }
}
