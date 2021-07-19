'use strict';

// Game module
const game = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  return {
    board,
  };
})();

const Player = (tictac) => {
  const setTictac = () => tictac;
  return { setTictac };
};

const player1 = Player('o');

const controlGame = (() => {
  const _squares = document.querySelectorAll('.square');

  const _placeTicTac = (e) => {
    const squareEl = e.target.closest('.square');

    if (squareEl.dataset.filled === 'true') return;

    game.board[squareEl.dataset.id - 1] = player1.setTictac();

    controlDisplay.fillBoard();
  };

  const addSquareEvents = () => {
    _squares.forEach((square) =>
      square.addEventListener('click', _placeTicTac)
    );
  };

  return { addSquareEvents };
})();

const controlDisplay = (() => {
  const _squares = document.querySelectorAll('.square');

  const fillBoard = () => {
    _squares.forEach(
      (square) =>
        (square.innerHTML = `<div class="place-${
          game.board.flat()[square.dataset.id - 1]
        }"></div> `)
    );
  };

  return { fillBoard };
})();

controlGame.addSquareEvents();
controlDisplay.fillBoard();
