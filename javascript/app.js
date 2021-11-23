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
    setTimeout(() => {
      modelMessage("DRAW");
    }, 1000);
    modelMessageColor("draw");
  }
}

function modelMessageColor(playerName) {
  model.querySelector(".message").className = "message";
  model.querySelector(".message").classList.add(playerName);
}

function modelMessage(message) {
  model.classList.remove("hide");
  model.querySelector(".message").textContent = message;
  startBtn.textContent = "RESTART";
}

const check_winner_proto = {
  check_winner() {
    const pc = this.pickedCells;
    if (pc.length >= 3 && hasWon()) {
      // update the score on UI
      this.score++;
      const score = document.querySelector(`.${this.symbol}-score`);
      score.textContent = this.score;

      // prevent user from selecting while animating
      main.style.pointerEvents = "none";

      // Model pop-up and show message
      setTimeout(() => {
        modelMessage(`${this.name} WON`);
      }, 1500);
      modelMessageColor(this.name);
    }

    // TRIPLET SUM ALGORITHM TO FIND IF PLAYER IS WIN
    /* I'M USING MAGIC SQUARE BOX WHICH MEAN
      IF TRIPLET SUM OF PICKED CELL IS EQUAL TO 15,
      THEY WIN */
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
  player.score = 0;
  player.pickedCells = [];
  player.symbol = symbol;
  player.symbol_el = `<img src="./images/${symbol}.png" class="${symbol}" />`;

  return player;
}

function startGame() {
  main.style.pointerEvents = "all";
  // restart the player's pickedCells in case they were already picked
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
          cell.innerHTML = playerX.symbol_el;
          playerX.pickedCells.push(Number(cell.id));
          playerX.check_winner();
          your_turn = !your_turn;
        } else {
          cell.innerHTML = playerO.symbol_el;
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
