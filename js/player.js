import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(playertype, playername) {
    this.playertype = playertype;
    this.playername = playername;
  }

  getRandomCoordinate() {
    const letters = "ABCDEFGHIJ";
    const randomLetters = letters[Math.floor(Math.random() * letters.length)];
    const randomDigit = Math.floor(Math.random() * 10);
    return randomLetters + randomDigit;
  }

  makeRandomMove(target) {
    if (
      (!target.missedShots || target.missedShots.length === 0) &&
      (!target.targetedShots || target.targetedShots.length === 0)
    ) {
      return this.getRandomCoordinate();
    } else {
      if (target.getCloseTarget()) {
        return target.getCloseTarget();
      } else {
        let random;

        do {
          random = this.getRandomCoordinate();
        } while (
          target.targetedShots.includes(random) ||
          target.missedShots.includes(random)
        );

        return random;
      }
    }
  }

  placeAllShipRandomly(gameboard, shipName, shipLength) {
    const letters = "ABCDEFGHIJ";
    let placed = false;

    while (!placed) {
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const randomDigit = Math.floor(Math.random() * 10);
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      const letterIndex = letters.indexOf(randomLetter);

      if (direction === "horizontal") {
        if (randomDigit + shipLength - 1 > 9) {
          continue;
        }
      } else {
        if (letterIndex + shipLength - 1 > 9) {
          continue;
        }
      }

      let coord = [];

      for (let i = 0; i < shipLength; i++) {
        if (direction === "horizontal") {
          coord.push(randomLetter + (randomDigit + i));
        } else {
          coord.push(letters[letterIndex + i] + randomDigit);
        }
      }
      const newShip = new Ship("Computer", shipName, shipLength, coord);
      placed = gameboard.placeShip(newShip, coord);
    }
  }
}
