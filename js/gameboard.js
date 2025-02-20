import { Ship } from "./ship.js";

export class Gameboard {
  constructor(boardname) {
    this.boardname = boardname;
    this.ships = [];
    this.missedShots = [];
    this.targetedShots = [];
  }

  placeShip(ship, coordinates) {
    for (const coord of coordinates) {
      for (const placedShip of this.ships) {
        if (placedShip.coordinates.includes(coord)) {
          return false; // this coordinate is already occupied.
        }
      }
    }
    this.ships.push({ ship: ship, coordinates: coordinates });
    return true; // this coordinate is available.
  }

  receiveAttack(attackCoordinate) {
    // Send this as a String
    const exists = this.ships.find((ship) =>
      ship.coordinates.some((c) => c === attackCoordinate)
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

  getNeighborCoordinates(coord) {
    const letters = "ABCDEFGHIJ";
    const letter = coord[0];
    const digit = parseInt(coord.slice(1));
    const neighbors = [];

    const letterIndex = letters.indexOf(letter);

    if (letterIndex > 0) {
      neighbors.push(letters[letterIndex - 1] + digit);
    }

    if (letterIndex < letters.length - 1) {
      neighbors.push(letters[letterIndex + 1] + digit);
    }

    if (digit > 0) {
      neighbors.push(letter + (digit - 1));
    }

    if (digit < 9) {
      neighbors.push(letter + (digit + 1));
    }

    return neighbors;
  }

  getCloseTarget() {
    const lastAttackCoord = this.targetedShots[this.targetedShots.length - 1];

    if (!lastAttackCoord) {
      return false;
    }

    const neighbors = this.getNeighborCoordinates(lastAttackCoord);

    const validNeighbors = neighbors.filter((coord) => {
      return (
        !this.targetedShots.includes(coord) &&
        !this.missedShots.includes(coord)
      );
    });

    if (validNeighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * validNeighbors.length);
      return validNeighbors[randomIndex];
    }
    return false;
  }
}
