'use strict';

// Game module
const game = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  return {
    board,
  };
})();

// Set players
const Player = (tictac, name) => {
  const getTictac = () => tictac;
  const getName = () => alert('Your name please');
  return { getTictac, getName };
};

const player1 = Player('o');
const player2 = Player('x');

const controlGame = (() => {
  const _squares = document.querySelectorAll('.square');
  let currPlayer = _switchPlayer();
  let win;

  function _switchPlayer(player = player1) {
    return player === player1 ? player2 : player1;
  }

  function _placeTicTac(e) {
    const squareEl = e.target.closest('.square');

    if (win) return;
    if (squareEl.dataset.filled === 'true') return;

    game.board[squareEl.dataset.id] = currPlayer.getTictac();
    squareEl.dataset.filled = 'true';

    currPlayer = _switchPlayer(currPlayer);
    controlDisplay.fillBoard();
    _checkWin();
    _checkDraw();
  }

  function _checkWin() {
    let winningIndices = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningIndices.length; i++) {
      if (
        game.board[winningIndices[i][0]] &&
        game.board[winningIndices[i][1]] &&
        game.board[winningIndices[i][2]] &&
        game.board[winningIndices[i][0]] === game.board[winningIndices[i][1]] &&
        game.board[winningIndices[i][0]] === game.board[winningIndices[i][2]]
      ) {
        win = true;
      }
    }
  }

  function _checkDraw() {
    if (Array.from(_squares).every((el) => el.dataset.filled === 'true')) {
      console.log('DRAW');
    }
  }

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
          game.board.flat()[square.dataset.id]
        }"></div> `)
    );
  };

  return { fillBoard };
})();

controlGame.addSquareEvents();
controlDisplay.fillBoard();
