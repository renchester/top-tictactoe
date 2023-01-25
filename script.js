'use strict';

const boardState = (function () {
  let gamePlay = true;
  let player1;
  let player2;
  let currentPlayer;
  let board = [];

  function init() {
    displayController.addEventsOnInit();
  }

  function startGame(name1, name2) {
    player1 = Player(name1, 'X');
    player2 = Player(name2, 'O');

    gamePlay = true;
    currentPlayer = player1;

    displayController.addEventsOnBoard();
  }

  function calculateResult() {
    let result = false;

    // Check for tie
    if (board.every((item) => item > 1)) result = 'tie';

    //  Check win through rows
    if (currentPlayer.getRow().find((x) => x === 3)) {
      result = 'win';
    }
    // Check win through columns
    if (currentPlayer.getColumn().find((x) => x === 3)) {
      result = 'win';
    }
    //  Check win through diagonals
    if (currentPlayer.getDiagonals().find((x) => x === 3)) {
      result = 'win';
    }

    return result;
  }

  function goToNextPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function getMarkToDisplay() {
    return currentPlayer.getMark();
  }

  function endGame(result) {
    if (result === 'win') currentPlayer.incrementScore();

    gamePlay = false;

    displayController.displayResult(result);
  }

  function checkDiagonals(row, col) {
    // Check diagonal 1 condition
    if (row === col) currentPlayer.incrementDiagonal1();

    //  Check diagonal 2 condition
    if (+row + +col + 1 === 3) currentPlayer.incrementDiagonal2();
  }

  function addToBoard(cellIndex, rowIndex, colIndex) {
    // Fill up board array with user input
    board[cellIndex] = getMarkToDisplay();

    // User input is tabulated in row and column values
    currentPlayer.incrementRow(rowIndex);
    currentPlayer.incrementColumn(colIndex);

    // Diagonal values are checked for win condition
    checkDiagonals(rowIndex, colIndex);

    const result = calculateResult();

    if (result) endGame(result);

    goToNextPlayer();
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  return {
    init,
    startGame,
    calculateResult,
    addToBoard,
    getMarkToDisplay,
    getCurrentPlayer,
  };
})();

const displayController = (function () {
  const cells = document.querySelectorAll('.board-cell');
  const scoresheet1 = document.querySelector('.scoresheet--player1');
  const scoresheet2 = document.querySelector('.scoresheet--player2');

  function hideEl(el) {
    el.classList.add('hidden');
  }

  function showEl(el) {
    el.classList.remove('hidden');
  }

  function printMove(e) {
    const playerMark = boardState.getMarkToDisplay();
    const cell = +e.target.dataset.id;
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.column;

    // Print move and remove listener so cell can only be clicked once
    e.target.textContent = playerMark;
    e.target.removeEventListener('click', printMove);

    // Share move to boardState
    boardState.addToBoard(cell, row, col);
  }

  function showNameInputScreen() {
    const selectScreen = document.querySelector('.screen--select');
    const inputScreen = document.querySelector('.screen--name-input');

    hideEl(selectScreen);
    showEl(inputScreen);
  }

  function showBoard() {
    const player1 = document.querySelector('.input--player1').value;
    const player2 = document.querySelector('.input--player2').value;
    const inputScreen = document.querySelector('.screen--name-input');
    const board = document.querySelector('.screen--board');

    boardState.startGame(player1, player2);

    hideEl(inputScreen);
    showEl(board);
    showEl(scoresheet1);
    showEl(scoresheet2);

    // Render scoresheet
    scoresheet1.querySelector('.scoresheet--player-name').textContent = player1;
    scoresheet2.querySelector('.scoresheet--player-name').textContent = player2;
  }

  function updateScoresheet() {
    const name1 = scoresheet1.querySelector('.scoresheet--player-name');
    const name2 = scoresheet2.querySelector('.scoresheet--player-name');
    const score1 = scoresheet1.querySelector('.scoresheet--player-score');
    const score2 = scoresheet2.querySelector('.scoresheet--player-score');
    const currentPlayer = boardState.getCurrentPlayer();

    if (name1.textContent === currentPlayer.getName()) {
      score1.textContent = currentPlayer.getScore();
    } else if (name2.textContent === currentPlayer.getName()) {
      score2.textContent = currentPlayer.getScore();
    }
  }

  function addEventsOnInit() {
    const versusPlayer = document.querySelector('.select-vs--player');
    const versusAI = document.querySelector('.select-vs--ai');
    const btnStart = document.querySelector('.btn-start');

    versusPlayer.addEventListener('click', showNameInputScreen);
    btnStart.addEventListener('click', showBoard);
  }

  function addEventsOnBoard() {
    cells.forEach((cell) => cell.addEventListener('click', printMove));
  }

  function displayResult(result) {
    const displayScreen = document.querySelector('.display-winner');
    const displayText = document.querySelector('.display-winner--text');
    showEl(displayScreen);

    cells.forEach((cell) => cell.removeEventListener('click', printMove));

    if (result === 'win') {
      displayText.textContent = `${boardState
        .getCurrentPlayer()
        .getName()} won!`;

      updateScoresheet();
    } else if (result === 'tie') displayText.textContent = `It's a draw!`;
  }

  return {
    addEventsOnBoard,
    addEventsOnInit,
    displayResult,
  };
})();

const Player = (givenName, givenMark) => {
  let name = givenName;
  let mark = givenMark;
  let score = 0;
  let rowArr = [0, 0, 0];
  let columnArr = [0, 0, 0];
  let diagonal1 = 0;
  let diagonal2 = 0;

  const getScore = () => score;
  const getMark = () => mark;
  const getName = () => name;
  const getRow = () => rowArr;
  const getColumn = () => columnArr;
  const getDiagonals = () => [diagonal1, diagonal2];

  function incrementRow(index) {
    rowArr[index] += 1;
  }

  function incrementColumn(index) {
    columnArr[index] += 1;
  }

  function incrementDiagonal1() {
    diagonal1++;
  }

  function incrementDiagonal2() {
    diagonal2++;
  }

  function incrementScore() {
    score++;
  }

  return {
    getScore,
    getMark,
    getName,
    getRow,
    getColumn,
    getDiagonals,
    incrementRow,
    incrementColumn,
    incrementDiagonal1,
    incrementDiagonal2,
    incrementScore,
  };
};

boardState.init();
