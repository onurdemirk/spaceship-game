
import hitSound from '/sounds/hit.mp3';
import missSound from '/sounds/miss.mp3';
import errorSound from '/sounds/error.mp3';
import hal from '/sounds/hal9000.mp3';
import cantdo from '/sounds/cantdo.mp3';
import stay from '/sounds/stay.mp3';

export class GameSounds {
  constructor() {
    this.sounds = {
      hit: new Audio(hitSound),
      miss: new Audio(missSound),
      error: new Audio(errorSound),
      hal: new Audio(hal),
      cantdo: new Audio(cantdo),
      stay: new Audio(stay),
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
