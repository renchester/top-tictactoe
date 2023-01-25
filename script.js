'use strict';

const boardState = (function () {
  let gamePlay = true;
  let currentPlayer;

  function calculateResult() {
    let win = false;

    //  Check win through rows
    if (currentPlayer.getRow().find((x) => x === 3)) {
      win = true;
    }
    // Check win through columns
    if (currentPlayer.getColumn().find((x) => x === 3)) {
      win = true;
    }
    //  Check win through diagonals
    if (currentPlayer.getDiagonals().find((x) => x === 3)) {
      win = true;
    }

    return win;
  }

  function goToNextPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function getMarkToDisplay() {
    return currentPlayer.getMark();
  }

  function startGame() {
    gamePlay = true;
    currentPlayer = player1;
  }

  function endGame() {
    currentPlayer.incrementScore();
    gamePlay = false;

    console.log(`${currentPlayer.getName()} won`);

    displayController.displayResult();
  }

  function checkDiagonals(row, col) {
    // Check diagonal 1 condition
    if (row === col) currentPlayer.incrementDiagonal1();

    //  Check diagonal 2 condition
    if (+row + +col + 1 === 3) currentPlayer.incrementDiagonal2();
  }

  function addToBoard(rowIndex, colIndex) {
    // User input is tabulated in row and column values
    currentPlayer.incrementRow(rowIndex);
    currentPlayer.incrementColumn(colIndex);

    // Diagonal values are checked for win condition
    checkDiagonals(rowIndex, colIndex);

    if (calculateResult()) endGame();

    goToNextPlayer();
  }

  return {
    startGame,
    calculateResult,
    addToBoard,
    getMarkToDisplay,
  };
})();

const displayController = (function () {
  const cells = document.querySelectorAll('.board-cell');

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

  function addEvent() {
    cells.forEach((cell) => cell.addEventListener('click', printMove));
  }

  function displayResult() {
    cells.forEach((cell) => cell.removeEventListener('click', printMove));
  }

  return {
    addEvent,
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
    score += 1;
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

const player1 = Player('chester', 'X');
const player2 = Player('ren', 'O');

boardState.startGame();
displayController.addEvent();
