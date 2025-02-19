export class Ship {
  constructor(player, ship, length, location) {
    this.player = player;
    this.ship = ship;

    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.location = location;
  }

  hit() {
    this.hits++;
    return this.isSunk();
  }

  isSunk() {
    if (this.hits === this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
