import "../styles.css";

import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { GameSounds } from "./sound.js";
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

let gameEnded = false;

const gameSounds = new GameSounds();

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
    gameSounds.play("error");
    await typeWriter("myText", "HAL: Invalid coordinates!", 25);
  }

  if (result === "hit") {
    e.target.classList.add("hit");
    e.target.textContent = "💥";

    if (foundShip && foundShip.ship.isSunk()) {
      disableBoard(computerBoard);

      gameSounds.play("hit");
      await typeWriter(
        "myText",
        `HAL: ${foundShip.ship.ship} DESTROYED! Radiation levels critical!`,
        20
      );
      gameSounds.sounds.hal.pause();
    } else {
      disableBoard(computerBoard);
      gameSounds.play("hit");
      gameSounds.play("hal");

      await typeWriter("myText", "HAL: Direct hit! Hull breach detected!", 20);
      gameSounds.sounds.hal.pause();
    }
  } else if (result === "miss") {
    gameSounds.play("miss");

    e.target.classList.add("missed");
    e.target.textContent = "✨";

    disableBoard(computerBoard);
    gameSounds.play("hal");

    await typeWriter("myText", "HAL: Plasma burst missed target!", 20);
    gameSounds.sounds.hal.pause();
  }

  gameTurn = "computer";
  await checkWinner();
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

const checkWinner = async () => {
  if (gameEnded) return true;

  const computerFailed = computerGameboard.allSink();
  const playerFailed = playerGameboard.allSink();

  const showEndGame = async (message, effect) => {
    gameEnded = true;

    const existingButtons = gameScreen.querySelectorAll(".again-button");
    existingButtons.forEach((button) => button.remove());

    const againButton = document.createElement("div");
    againButton.classList.add("button", "again-button");
    againButton.innerText = "Again?";

    againButton.addEventListener("click", async () => {
      gameSounds.play("cantdo");
      await typeWriter(
        "myText",
        "HAL: I'm sorry Dave. I'm afraid I can't do that.",
        30
      );
      setTimeout(() => location.reload(), 4000);
    });

    disableBoard(computerBoard);

    await typeWriter("myText", message, 50);

    await new Promise((resolve) => setTimeout(resolve, 500));
    effect();

    gameScreen.appendChild(againButton);
  };

  if (computerFailed) {
    await showEndGame(
      "HAL: VICTORY ACHIEVED! Sector secured.",
      showBlackHoleEffect
    );
    return true;
  } else if (playerFailed) {
    await showEndGame(
      "HAL: CRITICAL FAILURE... Life support failing.",
      showInterstellarExplosion
    );
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
    gameSounds.play("hit");
    cell.classList.add("hit");
    cell.textContent = "🔥";
    gameSounds.play("hal");
    await typeWriter(
      "myText",
      `HAL: INCOMING! ${getShipName(coord)} under fire!`,
      20
    );
    gameSounds.sounds.hal.pause();
  } else {
    gameSounds.play("miss");
    cell.classList.add("missed");
    cell.textContent = "🌠";
    gameSounds.play("hal");
    await typeWriter("myText", "HAL: Enemy fire missed our position!", 20);
    gameSounds.sounds.hal.pause();
  }

  await checkWinner();
  gameTurn = "player";
  setTimeout(gamePlay, 1000);
};

const playerTurn = async () => {
  gameSounds.play("hal");
  await typeWriter("myText", "HAL: Your turn Captain!", 20);
  gameSounds.sounds.hal.pause();
  enableBoard(computerBoard);
};

const getShipName = (coord) => {
  const found = playerGameboard.ships.find((item) =>
    item.coordinates.includes(coord)
  );
  return found ? found.ship.ship : "Unknown ship";
};

const gamePlay = async () => {
  if (await checkWinner()) return;

  if (gameTurn === "player") {
    await playerTurn();
  } else {
    disableBoard(computerBoard);
    setTimeout(async () => {
      await computerTurn();
    }, 1000);
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

  gameSounds.play("hal");

  await typeWriter(
    "myText",
    `HAL: Greetings Captain ${pNameInput.value}\n` +
      `I am HAL9000 - Fleet Command Interface\n` +
      `Deploy Mothership to counter imminent threat\n` +
      `[SPACE to rotate alignment]`,
    25
  );

  gameSounds.sounds.hal.pause();

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
      gameSounds.play("error");
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

      gameSounds.play("hal");

      await typeWriter(
        "myText",
        shipMessages[nextShip.name].deploy(nextShip.name, letterIndex, digit),
        20
      );

      gameSounds.sounds.hal.pause();

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

      gameSounds.play("hal");

      await typeWriter(
        "myText",
        `All vessels operational. 
  WARNING: 23 enemy signatures detected in ${Math.random().toFixed(
    2
  )} AU range. 
  INITIATE COMBIT PROTOCOL [FIRE WHEN READY]`,
        25
      );

      gameSounds.sounds.hal.pause();

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
        gameSounds.play("error");
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
        gameSounds.play("error");
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

  if (!isMusicPlaying) {
    gameSounds.play("stay");
    musicControl.querySelector("i").classList.replace("fa-play", "fa-pause");
    isMusicPlaying = true;
  }

  prepareGame(gameScreen, playerNameInput, playerNameH2);
});

const musicControl = document.getElementById("musicBtn");
let isMusicPlaying = false;

musicControl.addEventListener("click", () => {
  isMusicPlaying = !isMusicPlaying;

  const icon = musicControl.querySelector("i");
  if (isMusicPlaying) {
    gameSounds.play("stay");
    icon.classList.replace("fa-play", "fa-pause");
  } else {
    gameSounds.sounds.stay.pause();
    icon.classList.replace("fa-pause", "fa-play");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  musicControl.querySelector("i").classList.add("fa-play");
});
