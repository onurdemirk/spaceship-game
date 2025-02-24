import MothershipImg from "../img/Mothership.png";
import DreadnoughtImg from "../img/Dreadnought.png";
import InterceptorImg from "../img/Interceptor.png";
import PhantomImg from "../img/Phantom.png";
import ScoutImg from "../img/Scout.png";

const letters = "ABCDEFGHIJ";

export const createGameBoard = (board) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.coord = `${letters[i]}${j}`;
      board.appendChild(cell);
    }
  }
};

export const typeWriter = (elementId, text, speed) => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        element.innerHTML += '<span class="cursor">|</span>';
        resolve();
      }
    }, speed);
  });
};

export let shipsToPlace = [
  { name: "Mothership", length: 5, img: MothershipImg },
  { name: "Dreadnought", length: 4, img: DreadnoughtImg },
  { name: "Interceptor", length: 3, img: InterceptorImg },
  { name: "Phantom", length: 3, img: PhantomImg },
  { name: "Scout", length: 2, img: ScoutImg },
];

export const shipMessages = {
  Mothership: {
    deploy: (shipName) =>
      `HAL: Critical threat detected\n` +
      `Deploy Mothership to establish defense perimeter\n` +
      `[SPACE to rotate formation]`,
    error: () => `Deployment failed - Adjust position to stabilize orbit`,
  },

  Dreadnought: {
    deploy: (shipName) =>
      `HAL: Heavy cruiser formation approaching\n` +
      `Position Dreadnought for countermeasures\n` +
      `[SPACE to rotate]`,
    error: () => `Collision alert - Select alternate coordinates`,
  },

  Interceptor: {
    deploy: (shipName) =>
      `HAL: Fighter swarm incoming\n` +
      `Launch Interceptor squadron\n` +
      `[SPACE to rotate]`,
    error: () => `Deployment failure - Plasma storm interference`,
  },

  Phantom: {
    deploy: (shipName) =>
      `HAL: Stealth protocol required\n` +
      `Cloak Phantom for covert operations\n` +
      `[SPACE to rotate]`,
    error: () => `Realign stealth systems`,
  },

  Scout: {
    deploy: (shipName) =>
      `HAL: Reconnaissance needed\n` +
      `Deploy Scout for threat assessment\n` +
      `[SPACE to rotate]`,
    error: () => `Scout systems compromised - Reset sensor array`,
  },
};

export const showInterstellarExplosion = () => {
  const explosion = document.createElement("div");
  explosion.style.pointerEvents = "none";
  explosion.style.position = "fixed";
  explosion.style.top = "0";
  explosion.style.left = "0";
  explosion.style.width = "100%";
  explosion.style.height = "100%";
  explosion.style.background =
    "radial-gradient(circle, #ff6600 0%, #ff0000 100%)";
  explosion.style.opacity = "0";
  explosion.style.animation = "supernovaFlash 3s";
  document.body.appendChild(explosion);
};

export const showBlackHoleEffect = () => {
  explosion.style.pointerEvents = "none";

  const boards = document.querySelectorAll(".board");
  boards.forEach((board) => {
    board.style.background = "radial-gradient(circle, #000 20%, #2a0033 80%)";
    board.style.animation = "blackHolePulse 4s infinite";
  });
  setTimeout(() => {
    boards.forEach((board) => {
      board.style.animation = "none";
    });
  }, 5000);
};

export const disableBoard = (board) => {
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.style.pointerEvents = "none";
    cell.style.cursor = "not-allowed";
  });
};

export const enableBoard = (board) => {
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.style.pointerEvents = "auto";
    cell.style.cursor = "crosshair";
  });
};
