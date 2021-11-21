const cells = document.querySelectorAll(".cell");

const check_winner_proto = {
  check_winner() {
    const pc = this.pickedCells;
    if (pc.length >= 3 && hasWon()) {
      console.log("Yayy");
    }

    function hasWon() {
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

(function () {
  let your_turn = true;

  cells.forEach((c) => {
    c.addEventListener(
      "click",
      () => {
        if (your_turn) {
          c.innerHTML = playerX.symbol;
          playerX.pickedCells.push(Number(c.dataset.cell));
          playerX.check_winner();
          your_turn = !your_turn;
        } else {
          c.innerHTML = playerO.symbol;
          playerO.pickedCells.push(Number(c.dataset.cell));
          playerO.check_winner();

          your_turn = !your_turn;
        }
      },
      { once: true }
    );
  });
})();
