import "../styles.css";

import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import {
  createGameBoard,
  typeWriter,
  shipsToPlace,
  shipMessages,
  showInterstellarExplosion,
  showBlackHoleEffect,
  disableBoard,
  enableBoard,
} from "./functions.js";

export const playerBoard = document.getElementById("player-board");
export const computerBoard = document.getElementById("computer-board");
const playerNameH2 = document.getElementById("fleet-text");
const playerNameInput = document.getElementById("fname");
const gameForm = document.getElementById("gameForm");
const gameScreen = document.getElementById("game-screen");

createGameBoard(playerBoard);
createGameBoard(computerBoard);

playerBoard.querySelectorAll(".cell").forEach((cell) => {
  cell.style.pointerEvents = "none";
});

computerBoard.querySelectorAll(".cell").forEach((cell) => {
  cell.style.pointerEvents = "none";
});

const letters = "ABCDEFGHIJ";
let placementDirection = "horizontal";
let currentShipIndex = 0;

export let playerGameboard = new Gameboard("Player Board");
export let computerGameboard = new Gameboard("Computer Board");
export let computerPlayer = new Player("computer", "computerPlayer");

let gameTurn = "player";

const attack = async (e) => {
  const coord = e.target.dataset.coord;
  const result = computerGameboard.receiveAttack(coord);
  const foundShip = computerGameboard.ships.find((ship) =>
    ship.coordinates.includes(coord)
  );

  if (result === false) {
    await typeWriter("myText", "HAL: Invalid coordinates!", 25);
  }

  if (result === "hit") {
    e.target.classList.add("hit");
    e.target.textContent = "💥";

    if (foundShip && foundShip.ship.isSunk()) {
      disableBoard(computerBoard);

      await typeWriter(
        "myText",
        `HAL: ${foundShip.ship.ship} DESTROYED! Radiation levels critical!`,
        25
      );
    } else {
      disableBoard(computerBoard);

      await typeWriter("myText", "HAL: Direct hit! Hull breach detected!", 30);
    }
  } else if (result === "miss") {
    e.target.classList.add("missed");
    e.target.textContent = "✨";

    disableBoard(computerBoard);

    await typeWriter("myText", "HAL: Plasma burst missed target!", 30);
  }

  gameTurn = "computer";
  checkWinner();
  setTimeout(gamePlay, 1000);
};

const handleHoverforPlay = (e) => {
  e.target.classList.add("attack-preview");
};

const clearHoverforPlay = () => {
  document.querySelectorAll(".attack-preview").forEach((cell) => {
    cell.classList.remove("attack-preview");
  });
};

const checkWinner = () => {
  const computerFailed = computerGameboard.allSink();
  const playerFailed = playerGameboard.allSink();

  if (computerFailed) {
    disableBoard(computerBoard);
    typeWriter("myText", "HAL: VICTORY ACHIEVED! Sector secured.", 70);
    showBlackHoleEffect();
    return true;
  } else if (playerFailed) {
    disableBoard(computerBoard);
    typeWriter("myText", "HAL: CRITICAL FAILURE... Life support failing.", 70);
    showInterstellarExplosion();
    return true;
  }
  return false;
};

const computerTurn = async () => {
  const coord = computerPlayer.makeRandomMove(playerGameboard);
  const cell = playerBoard.querySelector(`[data-coord="${coord}"]`);

  if (!cell) return;

  const result = playerGameboard.receiveAttack(coord);
  cell.style.pointerEvents = "none";

  if (result === "hit") {
    cell.classList.add("hit");
    cell.textContent = "🔥";
    await typeWriter(
      "myText",
      `HAL: INCOMING! ${getShipName(coord)} under fire!`,
      25
    );
  } else {
    cell.classList.add("missed");
    cell.textContent = "🌠";
    await typeWriter("myText", "HAL: Enemy fire missed our position!", 25);
  }

  checkWinner();
  gameTurn = "player";
  setTimeout(gamePlay, 1000);
};

const playerTurn = async () => {
  await typeWriter("myText", "HAL: Your turn Captain!", 50);
  enableBoard(computerBoard);
};

const getShipName = (coord) => {
  const found = playerGameboard.ships.find((item) =>
    item.coordinates.includes(coord)
  );
  return found ? found.ship.ship : "Unknown ship";
};

const gamePlay = () => {
  if (checkWinner()) return;

  if (gameTurn === "player") {
    playerTurn();
  } else {
    disableBoard(computerBoard);
    setTimeout(computerTurn, 1000);
    gameTurn = "player";
  }
};

computerBoard.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("mouseenter", handleHoverforPlay);
  cell.addEventListener("mouseleave", clearHoverforPlay);
  cell.addEventListener("click", attack);
  cell.style.cursor = "crosshair";
});

export const prepareGame = async (div, pNameInput, pNameH2) => {
  div.innerHTML = "";
  pNameH2.innerText = `${pNameInput.value}'s Fleet`;

  const hel9000 = document.createElement("div");

  hel9000.id = "myText";
  hel9000.classList.add("myText");
  div.appendChild(hel9000);

  playerBoard.querySelectorAll(".cell").forEach((cell) => {
    cell.style.pointerEvents = "auto";
  });

  const ship = document.createElement("img");
  ship.src = shipsToPlace[0].img;
  ship.classList.add("ship-image");
  ship.alt = shipsToPlace[0].name;
  ship.style.marginTop = "5px";
  ship.style.marginLeft = "50px";
  ship.style.width = "200px";
  div.appendChild(ship);

  await typeWriter(
    "myText",
    `HAL: Greetings Captain ${pNameInput.value}\n` +
      `I am HAL9000 - Fleet Command Interface\n` +
      `Deploy Mothership to counter imminent threat\n` +
      `[SPACE to rotate alignment]`,
    25
  );

  document.addEventListener("keypress", (e) => {
    if (e.key === " ") {
      placementDirection =
        placementDirection === "horizontal" ? "vertical" : "horizontal";
    }
  });

  const handleHover = (e) => {
    clearHover();

    const coord = e.target.dataset.coord;
    const digit = parseInt(coord.slice(1));
    const letterIndex = letters.indexOf(coord[0]);
    const size = shipsToPlace[currentShipIndex].length;

    if (placementDirection === "horizontal") {
      for (let i = 0; i < size; i++) {
        const currentDigit = digit + i;
        if (currentDigit > 9) break;

        const targetCoord = `${coord[0]}${currentDigit}`;
        const cell = document.querySelector(`[data-coord="${targetCoord}"]`);

        if (cell) cell.classList.add("hover-preview");
      }
    } else if (placementDirection === "vertical") {
      for (let i = 0; i < size; i++) {
        const currentLetterIndex = letterIndex + i;
        if (currentLetterIndex > 9) break;

        const targetCoord = `${letters[currentLetterIndex]}${digit}`;
        const cell = document.querySelector(`[data-coord="${targetCoord}"]`);

        if (cell) cell.classList.add("hover-preview");
      }
    }
  };

  const clearHover = () => {
    document.querySelectorAll(".hover-preview").forEach((cell) => {
      cell.classList.remove("hover-preview");
    });
  };

  const shipSelection = async (e) => {
    const coord = e.target.dataset.coord;
    const size = shipsToPlace[currentShipIndex].length;
    const shipName = shipsToPlace[currentShipIndex].name;

    const digit = parseInt(coord.slice(1));
    const letterIndex = letters.indexOf(coord[0]);

    const showError = (msg) => {
      const errorMessage = document.createElement("div");
      errorMessage.innerText = msg;
      errorMessage.classList.add("errorMessage");
      hel9000.appendChild(errorMessage);
    };

    const removeErrorMessages = () => {
      const existingErrors = div.querySelectorAll(".errorMessage");
      existingErrors.forEach((error) => error.remove());
    };

    const updateGameScreen = async () => {
      const nextShip = shipsToPlace[currentShipIndex];

      const shipImgElement = div.querySelector(".ship-image");
      shipImgElement.src = nextShip.img;
      shipImgElement.alt = nextShip.name;

      playerBoard.querySelectorAll(".cell").forEach((cell) => {
        cell.style.pointerEvents = "none";
      });

      await typeWriter(
        "myText",
        shipMessages[nextShip.name].deploy(nextShip.name, letterIndex, digit),
        30
      );

      playerBoard.querySelectorAll(".cell").forEach((cell) => {
        cell.style.pointerEvents = "auto";
      });
    };

    const startGameScreen = async () => {
      playerBoard.querySelectorAll(".cell").forEach((cell) => {
        cell.removeEventListener("mouseenter", handleHover);
        cell.removeEventListener("mouseleave", clearHover);
        cell.removeEventListener("click", shipSelection);
      });

      await typeWriter(
        "myText",
        `All vessels operational. 
  WARNING: 23 enemy signatures detected in ${Math.random().toFixed(
    2
  )} AU range. 
  INITIATE COMBIT PROTOCOL [FIRE WHEN READY]`,
        25
      );

      for (let i = 0; i < shipsToPlace.length; i++) {
        computerPlayer.placeAllShipRandomly(
          computerGameboard,
          shipsToPlace[i].name,
          shipsToPlace[i].length
        );
      }

      div.removeChild(ship);

      const startButton = document.createElement("div");
      startButton.classList.add("button");
      startButton.innerText = "Start!";

      div.appendChild(startButton);

      startButton.addEventListener("click", () => {
        div.removeChild(startButton);
        gamePlay();
      });
    };

    removeErrorMessages();

    const shipArr = [];

    if (placementDirection === "horizontal") {
      if (digit + size > 10) {
        const nextShip = shipsToPlace[currentShipIndex];
        showError(
          shipMessages[nextShip.name].error(
            nextShip.name,
            coord,
            letterIndex,
            digit,
            size
          )
        );
        return;
      }
      for (let i = 0; i < size; i++) {
        shipArr.push(`${coord[0]}${digit + i}`);
      }
    } else if (placementDirection === "vertical") {
      if (letterIndex + size > 10) {
        const nextShip = shipsToPlace[currentShipIndex];
        showError(
          shipMessages[nextShip.name].error(nextShip.name, placementDirection)
        );
        return;
      }
      for (let i = 0; i < size; i++) {
        shipArr.push(`${letters[letterIndex + i]}${digit}`);
      }
    }

    const newShip = new Ship("Player", shipName, size, shipArr);
    const placedSuccessfully = playerGameboard.placeShip(newShip, shipArr);

    if (!placedSuccessfully) {
      showError("This position is already occupied. Choose a different spot.");
      return;
    }

    shipArr.forEach((c) => {
      const cell = document.querySelector(`[data-coord="${c}"]`);
      if (cell) cell.classList.add("ship-placed");
    });

    currentShipIndex++;
    if (currentShipIndex < shipsToPlace.length) {
      await updateGameScreen();
    } else {
      startGameScreen();
    }
  };

  playerBoard.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseenter", handleHover);
    cell.addEventListener("mouseleave", clearHover);
    cell.addEventListener("click", shipSelection);
    cell.style.cursor = "pointer";
  });
};

gameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!playerNameInput.checkValidity()) return;

  prepareGame(gameScreen, playerNameInput, playerNameH2);
});
