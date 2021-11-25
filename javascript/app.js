const main = document.querySelector("main");
const start_btn = document.querySelector("#model .btn");
const MAGIC_SQUARE_NUMBERS = [2, 7, 6, 9, 5, 1, 4, 3, 8];
let someone_has_won = false;

const model = {
  element: document.querySelector("#model"),
  message(symbol) {
    const message = model.element.querySelector(".message");

    message.className = "message";
    message.classList.add(symbol + "-color");

    this.element.classList.remove("hide");

    symbol === "draw"
      ? (message.textContent = "DRAW")
      : (message.textContent = symbol + " WON");

    start_btn.textContent = "RESTART";
  },
};

start_btn.addEventListener("click", () => {
  model.element.classList.add("hide");
  startGame();
});

function createCells() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = MAGIC_SQUARE_NUMBERS[i];
    main.appendChild(cell);
  }
}

function removeCells() {
  main.innerHTML = "";
}

function isDraw() {
  if (
    playerX.picked_cells.length + playerO.picked_cells.length === 9 &&
    !someone_has_won
  ) {
    setTimeout(() => {
      model.message("draw");
    }, 500);
  }
}

const check_winner_proto = {
  check_winner() {
    const picked_cell = this.picked_cells;
    const that = this;

    // RUN THIS BLOCK IF THE GAME HAS WON
    if (picked_cell.length >= 3 && hasWon()) {
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

    // TRIPLET SUM ALGORITHM TO FIND IF PLAYER IS WIN
    /* I'M USING MAGIC SQUARE BOX WHICH MEAN
      IF TRIPLET SUM OF PICKED CELL IS EQUAL TO 15,
      THEY WIN */
    function hasWon() {
      picked_cell.sort((a, b) => a - b);
      for (let i = 0; i < picked_cell.length; i++) {
        let left = i + 1;
        let right = picked_cell.length - 1;

        while (left < right) {
          if (picked_cell[i] + picked_cell[left] + picked_cell[right] === 15) {
            animate(picked_cell[i], picked_cell[left], picked_cell[right]);
            return true;
          }
          if (picked_cell[i] + picked_cell[left] + picked_cell[right] < 15) {
            left++;
          } else {
            right--;
          }
        }
      }
      return false;
    }

    function animate(num1, num2, num3) {
      const symbolElements = document.querySelectorAll(`.${that.symbol}`);
      symbolElements.forEach((symbol_el) => {
        if (
          symbol_el.parentElement.id == num1 ||
          symbol_el.parentElement.id == num2 ||
          symbol_el.parentElement.id == num3
        ) {
          symbol_el.classList.remove("animation-popup");
          symbol_el.classList.add("animation-fade-in-out");
        }
      });
    }
  },
};

const playerX = createPlayer("X");
const playerO = createPlayer("O");

function createPlayer(symbol) {
  const player = Object.create(check_winner_proto);

  const create_symbol_el = () => {
    const create_el = document.createElement("img");
    create_el.setAttribute("src", `./images/${symbol}.png`);
    create_el.className = symbol;
    create_el.classList.add("animation-popup");
    return create_el;
  };

  player.score = 0;
  player.picked_cells = [];
  player.symbol = symbol;
  player.symbol_el = create_symbol_el();

  return player;
}

function startGame() {
  someone_has_won = false;
  main.style.pointerEvents = "all";
  // restart the player's picked_cells in case they were already picked
  playerX.picked_cells = [];
  playerO.picked_cells = [];
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
          cell.appendChild(playerX.symbol_el.cloneNode(true));
          playerX.picked_cells.push(Number(cell.id));
          playerX.check_winner();
          your_turn = !your_turn;
        } else {
          cell.appendChild(playerO.symbol_el.cloneNode(true));
          playerO.picked_cells.push(Number(cell.id));
          playerO.check_winner();

          your_turn = !your_turn;
        }
        isDraw();
      },
      { once: true }
    );
  });
}
