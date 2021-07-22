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
  const defaultName = name;
  return { getTictac, defaultName };
};

const player1 = Player('o', 'Player 1');
const player2 = Player('x', 'Player 2');

// Game initializer module

const initializeGame = (() => {
  let opponent;
  const _opponents = document.querySelectorAll('.opponent');
  const _opponentPlayer = document.querySelector('.opponent.opp-player');
  const _opponentAI = document.querySelector('.opponent.opp-ai');
  const _namePlayer1 = document.querySelector('.player-1.name-input');
  const _namePlayer2 = document.querySelector('.player-2.name-input');
  const _btnStartGame = document.querySelector('.start-game');

  function _chooseOpponent(e) {
    opponent = e.target.closest('.opponent').dataset.opponent;
    controlDisplay.showPlayers();
  }

  function _startGame(e) {
    player1.name = _namePlayer1.value;
    player2.name = _namePlayer2.value;

    controlDisplay.showGame();
  }

  _opponents.forEach((el) => el.addEventListener('click', _chooseOpponent));

  _btnStartGame.addEventListener('click', _startGame);

  return { opponent };
})();

// Game controller module
const controlGame = (() => {
  const _squares = document.querySelectorAll('.square');
  let currPlayer = _switchPlayer();
  let result;

  function _switchPlayer(player = player1) {
    return player === player1 ? player2 : player1;
  }

  function _placeTicTac(e) {
    const squareEl = e.target.closest('.square');

    if (result) return;
    if (squareEl.dataset.filled === 'true') return;

    game.board[squareEl.dataset.id] = currPlayer.getTictac();
    squareEl.dataset.filled = 'true';

    _checkWin();
    _checkDraw();
    currPlayer = _switchPlayer(currPlayer);
    controlDisplay.fillBoard();
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
        result = 'win';
        controlDisplay.displayWinner();
      }
    }
  }

  function _checkDraw() {
    if (Array.from(_squares).every((el) => el.dataset.filled === 'true')) {
      result = 'draw';
    }
  }

  function addSquareEvents() {
    _squares.forEach((square) =>
      square.addEventListener('click', _placeTicTac)
    );
  }

  return { addSquareEvents, currPlayer, result };
})();

// Display Controller Module
const controlDisplay = (() => {
  const _squares = document.querySelectorAll('.square');
  const _gameOpponents = document.querySelector('.game-opponents');
  const _gamePlayers = document.querySelector('.game-players');
  const _gameContainer = document.querySelector('.game-container');
  const _winLog = document.querySelector('.win-log');
  const _winningPlayerMessage = document.querySelector(
    '.win-message.player-win'
  );

  function showPlayers() {
    _gameOpponents.classList.add('hidden');
    _gamePlayers.classList.remove('hidden');
  }

  function showGame() {
    _gamePlayers.classList.add('hidden');
    _gameContainer.classList.remove('hidden');
  }

  function fillBoard() {
    _squares.forEach(
      (square) =>
        (square.innerHTML = `<div class="tictac">${
          game.board.flat()[square.dataset.id]
        }</div>`)
    );
  }

  function displayWinner() {
    console.log(controlGame.currPlayer);
    _winningPlayerMessage.textContent = controlGame.currPlayer.defaultName;
    _winLog.classList.remove('hidden');
  }

  return { fillBoard, showPlayers, showGame, displayWinner };
})();

controlGame.addSquareEvents();
controlDisplay.fillBoard();

// `<div class="place-${
//           game.board.flat()[square.dataset.id]
//         }"></div> `
