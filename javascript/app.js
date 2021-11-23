const main = document.querySelector("main");
const startBtn = document.querySelector("#model .btn");
const MAGIC_SQUARE_NUMBERS = [2, 7, 6, 9, 5, 1, 4, 3, 8];
let someone_has_won = false;

const model = {
  element: document.querySelector("#model"),
  message: function (symbol) {
    const message = model.element.querySelector(".message");

    message.className = "message";
    message.classList.add(symbol + "-color");

    this.element.classList.remove("hide");

    symbol === "draw"
      ? (message.textContent = "DRAW")
      : (message.textContent = symbol + " WON");

    startBtn.textContent = "RESTART";
  },
};

startBtn.addEventListener("click", () => {
  model.element.classList.add("hide");
  startGame();
});

function createCells() {
  MAGIC_SQUARE_NUMBERS.forEach((num) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = num;
    main.appendChild(cell);
  });
}

function removeCells() {
  main.innerHTML = "";
}

function isDraw() {
  if (
    playerX.pickedCells.length + playerO.pickedCells.length === 9 &&
    !someone_has_won
  ) {
    setTimeout(() => {
      model.message("draw");
    }, 800);
  }
}

const check_winner_proto = {
  check_winner() {
    const pc = this.pickedCells;
    const that = this;

    // RUN THIS BLOCK IF THE GAME HAS WON
    if (pc.length >= 3 && hasWon()) {
      someone_has_won = true;
      // update the score on UI
      this.score++;
      const score = document.querySelector(`.${this.symbol}-score`);
      score.textContent = this.score;

      // prevent user from selecting while animating
      main.style.pointerEvents = "none";

      // Model pop-up and show message
      setTimeout(() => {
        model.message(this.symbol);
      }, 1200);
    }

    function animate(num1, num2, num3) {
      const symbolElements = document.querySelectorAll(`.${that.symbol}`);
      symbolElements.forEach((el) => {
        if (
          el.parentElement.id == num1 ||
          el.parentElement.id == num2 ||
          el.parentElement.id == num3
        ) {
          el.classList.add("animate");
        }
      });
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
            animate(pc[i], pc[left], pc[right]);
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

  player.score = 0;
  player.pickedCells = [];
  player.symbol = symbol;
  player.symbol_el = `<img src="./images/${symbol}.png" class="${symbol}" />`;

  return player;
}

function startGame() {
  someone_has_won = false;
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
