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
  const score = 0;
  return { getTictac, defaultName, score };
};

const player1 = Player('o', 'Player 1');
const player2 = Player('x', 'Player 2');

// Game initializer module

const initializeGame = (() => {
  let opponent;
  const _opponents = document.querySelectorAll('.opponent');
  const _opponentPlayer = document.querySelector('.opponent.opp-player');
  const _opponentAI = document.querySelector('.opponent.opp-ai');
  const _nameInputPlayer1 = document.querySelector('.player-1.name-input');
  const _nameInputPlayer2 = document.querySelector('.player-2.name-input');
  const _btnStartGame = document.querySelector('.start-game');

  function _chooseOpponent(e) {
    opponent = e.target.closest('.opponent').dataset.opponent;
    controlDisplay.showPlayers();
  }

  function _startGame(e) {
    player1.name = _nameInputPlayer1.value;
    player2.name = _nameInputPlayer2.value;

    controlDisplay.showGame();

    if (_nameInputPlayer1.value && _nameInputPlayer2.value)
      controlDisplay.displayNames();
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

  function _switchPlayer(player = player2) {
    return player === player1 ? player2 : player1;
  }

  function _placeTicTac(e) {
    const squareEl = e.target.closest('.square');

    if (result) return;
    if (squareEl.dataset.filled === 'true') return;

    game.board[squareEl.dataset.id] = currPlayer.getTictac();
    squareEl.dataset.filled = 'true';

    _checkDraw();
    _checkWin();
    controlDisplay.fillBoard();

    if (result) return;

    controlDisplay.displayActive(currPlayer);
    currPlayer = _switchPlayer(currPlayer);
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
        currPlayer.score++;
        controlDisplay.displayWinner(currPlayer);

        const _btnPlayAgain = document.querySelector('.btn.play-again');
        _btnPlayAgain.addEventListener('click', playAgain);
      }
    }
  }

  function _checkDraw() {
    if (Array.from(_squares).every((el) => el.dataset.filled === 'true')) {
      result = 'draw';
      controlDisplay.displayDraw();

      const _btnPlayAgain = document.querySelector('.btn.play-again');
      _btnPlayAgain.addEventListener('click', playAgain);
    }
  }

  function addSquareEvents() {
    _squares.forEach((square) =>
      square.addEventListener('click', _placeTicTac)
    );
  }

  function _resetFillStatus() {
    result = null;
    _squares.forEach((square) => (square.dataset.filled = 'false'));
  }

  function playAgain() {
    game.board = ['', '', '', '', '', '', '', '', ''];
    _resetFillStatus();
    currPlayer = _switchPlayer();
    controlDisplay.fillBoard();
    controlDisplay.resetGameDisplay();
  }

  return { addSquareEvents, currPlayer, result };
})();

// Display controller module

const controlDisplay = (() => {
  const _squares = document.querySelectorAll('.square');
  const _gameOpponents = document.querySelector('.game-opponents');
  const _gamePlayers = document.querySelector('.game-players');
  const _gameContainer = document.querySelector('.game-container');
  const _namePlayer1 = document.querySelector('.player-1.name');
  const _namePlayer2 = document.querySelector('.player-2.name');
  const _ssPlayer1 = document.querySelector('.player-1.scoresheet');
  const _ssPlayer2 = document.querySelector('.player-2.scoresheet');
  const _scorePlayer1 = document.querySelector('.player-1.score');
  const _scorePlayer2 = document.querySelector('.player-2.score');
  const _btnPlayAgain = document.querySelector('.btn.play-again');
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
        (square.innerHTML = `<div class="tictac
        ">${game.board.flat()[square.dataset.id]}</div>`)
    );
  }

  function displayNames() {
    _namePlayer1.textContent = player1.name;
    _namePlayer2.textContent = player2.name;
  }

  function displayActive(currPlayer) {
    document
      .querySelectorAll('.scoresheet')
      .forEach((sheet) => sheet.classList.remove('player-active'));

    currPlayer === player1
      ? _ssPlayer2.classList.add('player-active')
      : _ssPlayer1.classList.add('player-active');
  }

  function displayWinner(currPlayer) {
    _winningPlayerMessage.textContent = currPlayer.name
      ? currPlayer.name
      : currPlayer.defaultName;
    _winLog.classList.remove('hidden');
    _btnPlayAgain.classList.remove('hidden');

    _scorePlayer1.textContent = player1.score;
    _scorePlayer2.textContent = player2.score;
  }

  function displayDraw() {
    _winningPlayerMessage.textContent = 'Draw! No one';
    _winLog.classList.remove('hidden');
    _btnPlayAgain.classList.remove('hidden');

    document
      .querySelectorAll('.scoresheet')
      .forEach((sheet) => sheet.classList.remove('player-active'));
  }

  function resetGameDisplay() {
    _btnPlayAgain.classList.add('hidden');
    _winLog.classList.add('hidden');
  }

  return {
    fillBoard,
    showPlayers,
    showGame,
    displayActive,
    displayWinner,
    displayDraw,
    displayNames,
    resetGameDisplay,
  };
})();

controlGame.addSquareEvents();
controlDisplay.fillBoard();
