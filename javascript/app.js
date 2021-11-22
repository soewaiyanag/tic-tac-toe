const main = document.querySelector("main");
const model = document.getElementById("model");
const startBtn = model.querySelector(".btn");
const MAGIC_SQUARE_NUMBERS = [2, 7, 6, 9, 5, 1, 4, 3, 8];

function createCells() {
  MAGIC_SQUARE_NUMBERS.forEach((num) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = num;
    main.appendChild(cell);
  });
}

function removeCells() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.remove();
  });
}

const cells = document.querySelectorAll(".cell");

startBtn.addEventListener("click", () => {
  model.classList.add("hide");
  startGame();
});

function isDraw() {
  if (
    playerX.pickedCells.length + playerO.pickedCells.length === 9 &&
    model.classList.contains("hide")
  ) {
    modelMessage("DRAW");
    modelMessageColor("draw");
  }
}

function modelMessageColor(playerName) {
  model.querySelector("h1").className = playerName;
}

function modelMessage(message) {
  model.classList.remove("hide");
  model.querySelector("h1").textContent = message;
  startBtn.textContent = "RESTART";
}

const check_winner_proto = {
  check_winner() {
    const pc = this.pickedCells;
    if (pc.length >= 3 && hasWon()) {
      modelMessage(`${this.name} WON`);
      modelMessageColor(this.name);
    }

    function hasWon() {
      pc.sort((a, b) => a - b);
      for (let i = 0; i < pc.length; i++) {
        let left = i + 1;
        let right = pc.length - 1;

        while (left < right) {
          if (pc[i] + pc[left] + pc[right] === 15) {
            return true;
          }
          if (pc[i] + pc[left] + pc[right] < 15) {
            left++;
          } else {
            right--;
          }
        }
      }
      return false;
    }
  },
};

const playerX = createPlayer("X");
const playerO = createPlayer("O");

function createPlayer(symbol) {
  let player = Object.create(check_winner_proto);
  player.name = "Player" + symbol;
  player.pickedCells = [];
  player.symbol = `<img src="./images/${symbol}.png" class="${symbol}"" />`;

  return player;
}

function startGame() {
  playerX.pickedCells = [];
  playerO.pickedCells = [];
  removeCells();
  createCells();
  gameBoard();
}

function gameBoard() {
  const cells = document.querySelectorAll(".cell");
  let your_turn = true;
  cells.forEach((cell) => {
    cell.addEventListener(
      "click",
      () => {
        if (your_turn) {
          cell.innerHTML = playerX.symbol;
          playerX.pickedCells.push(Number(cell.id));
          playerX.check_winner();
          your_turn = !your_turn;
        } else {
          cell.innerHTML = playerO.symbol;
          playerO.pickedCells.push(Number(cell.id));
          playerO.check_winner();

          your_turn = !your_turn;
        }
        isDraw();
      },
      { once: true }
    );
  });
}
