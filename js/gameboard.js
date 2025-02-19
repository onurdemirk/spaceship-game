import { Ship } from "./ship.js";

export class Gameboard {
  constructor(boardname) {
    this.boardname = boardname;
    this.ships = [];
    this.missedShots = [];
    this.targetedShots = [];
  }

  placeShip(ship, coordinates) {
    this.ships.push({ ship: ship, coordinates: coordinates });
  }

  receiveAttack(attackCoordinate) {
    // Send this as a String
    const exists = this.ships.find((ship) =>
      ship.coordinates.some(c => c === attackCoordinate)
    );
    const alreadyTargeted = this.targetedShots.find(
      (coordinate) => coordinate === attackCoordinate
    );
    const alreadyMissed = this.missedShots.find(
      (coordinate) => coordinate === attackCoordinate
    );

    if (exists && !alreadyTargeted) {
      exists.ship.hit();
      this.targetedShots.push(attackCoordinate);
    } else if (!alreadyMissed) {
      this.missedShots.push(attackCoordinate);
    } else {
      return false;
    }
  }

  allSink() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }
}
