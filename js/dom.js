import { Player } from "/js/player.js";
import { Gameboard } from "./gameboard.js";

const letters = "ABCDEFGHIJ";
let selectedShip = "Mothership";
let placementDirection = "horizontal";
let gameboard;

export const createBoard = (board) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.coord = `${letters[i]}${j}`;
      board.appendChild(cell);
    }
  }
};

const getSelectedShipSize = () => {
  if (selectedShip === "Mothership") {
    return 5;
  } else if (selectedShip === "Dreadnought") {
    return 4;
  } else if (selectedShip === "Interceptor") {
    return 3;
  } else if (selectedShip === "Phantom") {
    return 3;
  } else if (selectedShip === "Scout") {
    return 2;
  }
};

function typeWriter(elementId, text, speed) {
  const element = document.getElementById(elementId);
  element.innerHTML = "";
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      // Yazı bittiğinde yanıp sönen bir imleç ekleyelim:
      element.innerHTML += '<span class="cursor">|</span>';
    }
  }, speed);
}

export const prepareGame = (div, pNameInput, pNameH2) => {
  div.innerHTML = "";
  pNameH2.innerText = `${pNameInput.value}'s Fleet`;

  const hel9000 = document.createElement("div");

  hel9000.id = "myText";
  hel9000.classList.add("myText");
  div.appendChild(hel9000);

  typeWriter(
    "myText",
    "Hello, Captain. I am HAL9000 and I will assist you with this mission. First, click 5 consecutive cells to place Mothership.",
    70
  );

  const ship = document.createElement("img");
  ship.src = "/img/Mothership.png";
  ship.classList.add("ship-image");
  ship.alt = "Mothership";
  ship.style.width = "300px";
  div.appendChild(ship);

  const handleHover = (e) => {
    const hoveredCell = e.target;
    const coord = e.target.dataset.coord;

    clearHover();

    const digit = parseInt(coord.slice(1));
    const letterIndex = letters.indexOf(coord[0]);
    let size = getSelectedShipSize();

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

  const shipSelection = (e) => {
    const hoveredCell = e.target;
    const coord = e.target.dataset.coord;
    const size = getSelectedShipSize();

    const digit = parseInt(coord.slice(1));
    const letterIndex = letters.indexOf(coord[0]);

    const existingErrors = div.querySelectorAll(".errorMessage");
    existingErrors.forEach((error) => error.remove());

    const shipArr = [];

    if (placementDirection === "horizontal") {
      if (digit + size <= 10) {
        for (let i = 0; i < size; i++) {
          const currentDigit = digit + i;
          shipArr.push(`${coord[0]}${currentDigit}`);
        }
      } else {
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = "Choose proper place for your ship";
        errorMessage.classList.add("errorMessage");
        div.appendChild(errorMessage);
      }
    } else if (placementDirection === "vertical") {
      if (letterIndex + size <= 10) {
        for (let i = 0; i < size; i++) {
          const currentLetter = letters[letterIndex + i];
          shipArr.push(`${currentLetter}${digit}`);
        }
      } else {
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = "Choose proper place for your ship";
        errorMessage.classList.add("errorMessage");
        div.appendChild(errorMessage);
      }
    }
  };

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseenter", handleHover);
    cell.addEventListener("mouseleave", clearHover);
    cell.addEventListener("click", shipSelection);
  });
};
