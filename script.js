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

  function playNextRound() {
    goToNextPlayer;

    displayController.resetBoard();

    gamePlay = true;
    board = [];
    player1.resetInput();
    player2.resetInput();
  }

  function resetAll() {
    displayController.resetToStart();

    board = [];
    player1.resetAll();
    player2.resetAll();
  }

  function calculateResult() {
    let result = false;

    // Check for tie
    if (board.length === 9) result = 'tie';

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

  function addToBoard(rowIndex, colIndex) {
    if (!gamePlay) return;

    // Fill up board array with user input
    board.push(getMarkToDisplay());

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
    addToBoard,
    getMarkToDisplay,
    getCurrentPlayer,
    playNextRound,
    resetAll,
  };
})();

const displayController = (function () {
  const versusPlayer = document.querySelector('.select-vs--player');
  const versusAI = document.querySelector('.select-vs--ai');
  const btnStart = document.querySelector('.btn-start');

  const selectScreen = document.querySelector('.screen--select');
  const inputScreen = document.querySelector('.screen--name-input');

  const board = document.querySelector('.screen--board');
  const cells = document.querySelectorAll('.board-cell');

  const scoresheet1 = document.querySelector('.scoresheet--player1');
  const scoresheet2 = document.querySelector('.scoresheet--player2');
  const name1 = scoresheet1.querySelector('.scoresheet--player-name');
  const name2 = scoresheet2.querySelector('.scoresheet--player-name');
  const score1 = scoresheet1.querySelector('.scoresheet--player-score');
  const score2 = scoresheet2.querySelector('.scoresheet--player-score');

  const displayScreen = document.querySelector('.display-winner');
  const displayText = document.querySelector('.display-winner--text');
  const btnPlayAgain = document.querySelector('.btn-play-again');
  const btnBack = document.querySelector('.btn-back');

  function hideEl(el) {
    el.classList.add('hidden');
  }

  function showEl(el) {
    el.classList.remove('hidden');
  }

  function printMove(e) {
    const playerMark = boardState.getMarkToDisplay();
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.column;

    // Print move and remove listener so cell can only be clicked once
    e.target.textContent = playerMark;
    e.target.removeEventListener('click', printMove);

    // Share move to boardState
    boardState.addToBoard(row, col);
  }

  function showNameInputScreen() {
    hideEl(selectScreen);
    showEl(inputScreen);
  }

  function showBoard() {
    const player1 = document.querySelector('.input--player1').value;
    const player2 = document.querySelector('.input--player2').value;

    boardState.startGame(player1, player2);

    hideEl(inputScreen);
    showEl(board);
    showEl(scoresheet1);
    showEl(scoresheet2);

    // Render scoresheet
    scoresheet1.querySelector('.scoresheet--player-name').textContent = player1;
    scoresheet2.querySelector('.scoresheet--player-name').textContent = player2;
  }

  function resetBoard() {
    cells.forEach((cell) => (cell.textContent = ''));

    hideEl(displayScreen);
    addEventsOnBoard();
  }

  function resetToStart() {
    resetBoard();
    hideEl(board);
    showEl(selectScreen);
    addEventsOnInit();
  }

  function updateScoresheet() {
    const currentPlayer = boardState.getCurrentPlayer();

    if (name1.textContent === currentPlayer.getName()) {
      score1.textContent = currentPlayer.getScore();
    } else if (name2.textContent === currentPlayer.getName()) {
      score2.textContent = currentPlayer.getScore();
    }
  }

  function addEventsOnInit() {
    versusPlayer.addEventListener('click', showNameInputScreen);
    btnStart.addEventListener('click', showBoard);
  }

  function addEventsOnBoard() {
    cells.forEach((cell) => cell.addEventListener('click', printMove));
    btnPlayAgain.addEventListener('click', boardState.playNextRound);
    btnBack.addEventListener('click', boardState.resetAll);
  }

  function displayResult(result) {
    showEl(displayScreen);

    cells.forEach((cell) => cell.removeEventListener('click', printMove));

    showEl(btnPlayAgain);

    if (result === 'win') {
      displayText.textContent = `${boardState
        .getCurrentPlayer()
        .getName()} won!`;

      updateScoresheet();
    } else if (result === 'tie') displayText.textContent = "It's a draw!";
  }

  return {
    addEventsOnBoard,
    addEventsOnInit,
    displayResult,
    resetBoard,
    resetToStart,
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

  function resetInput() {
    rowArr = [0, 0, 0];
    columnArr = [0, 0, 0];
    diagonal1 = 0;
    diagonal2 = 0;
  }

  function resetAll() {
    score = 0;
    resetInput();
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
    resetInput,
    resetAll,
  };
};

boardState.init();
