import displayController from './display.js';
import Player from './player.js';

const boardState = (function () {
  let gamePlay = true;
  let player1;
  let player2;
  let currentPlayer;
  let board = Array(9).fill(null);

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getMarkToDisplay() {
    return currentPlayer.getMark();
  }

  function startGame(name1, name2, isHuman1 = true, isHuman2 = true) {
    player1 = Player(name1, 'X', isHuman1);
    player2 = Player(name2, 'O', isHuman2);

    gamePlay = true;
    currentPlayer = player1;

    displayController.addEventsOnBoard();
  }

  function startGameVSComputer() {
    startGame('Human', 'Computer', true, false);
  }

  function goToNextPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function playNextRound() {
    displayController.resetBoard();

    gamePlay = true;
    board = Array(9).fill(null);
    player1.resetInput();
    player2.resetInput();

    if (!currentPlayer.isHuman()) {
      displayController.generateMove();
    }
  }

  function resetAll() {
    displayController.resetToStart();
    displayController.resetScoresheet();

    board = Array(9).fill(null);
    currentPlayer = player1;
    player1.resetInput();
    player2.resetInput();
  }

  function calculateResult(player = currentPlayer) {
    let result = false;

    // Check for tie
    if (board.every((item) => item !== null)) result = 'tie';

    //  Check win through rows
    if (player.getRow().find((x) => x === 3)) {
      result = 'win';
    }
    // Check win through columns
    if (player.getColumn().find((x) => x === 3)) {
      result = 'win';
    }
    //  Check win through diagonals
    if (player.getDiagonals().find((x) => x === 3)) {
      result = 'win';
    }

    return result;
  }

  function calculateResultAgainstAI(player = currentPlayer) {
    if (
      (board[0] === player.getMark() &&
        board[1] === player.getMark() &&
        board[2] === player.getMark()) ||
      (board[3] === player.getMark() &&
        board[4] === player.getMark() &&
        board[5] === player.getMark()) ||
      (board[6] === player.getMark() &&
        board[7] === player.getMark() &&
        board[8] === player.getMark()) ||
      (board[0] === player.getMark() &&
        board[3] === player.getMark() &&
        board[6] === player.getMark()) ||
      (board[1] === player.getMark() &&
        board[4] === player.getMark() &&
        board[7] === player.getMark()) ||
      (board[2] === player.getMark() &&
        board[5] === player.getMark() &&
        board[8] === player.getMark()) ||
      (board[0] === player.getMark() &&
        board[4] === player.getMark() &&
        board[8] === player.getMark()) ||
      (board[2] === player.getMark() &&
        board[4] === player.getMark() &&
        board[6] === player.getMark())
    ) {
      return 'win';
    }

    if (board.every((item) => item !== null)) {
      return 'tie';
    }

    return false;
  }

  function getEmptySquares(boardArray = board) {
    const emptyIndices = [];

    // Store empty slots in an array
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === null) emptyIndices.push(i);
    }

    return emptyIndices;
  }

  function minimax(currentBoard, mark, humanObj, computerObj) {
    const boardCopy = currentBoard;
    const emptySquares = getEmptySquares(boardCopy);

    const humanPlayer = humanObj;
    const computerPlayer = computerObj;

    const humanMark = humanPlayer.getMark();
    const computerMark = computerPlayer.getMark();

    if (calculateResultAgainstAI(humanPlayer) === 'win') {
      return { score: -1 };
    }

    if (calculateResultAgainstAI(computerPlayer) === 'win') {
      return { score: 1 };
    }

    if (!emptySquares.length) {
      return { score: 0 };
    }

    const testsDone = [];

    for (let i = 0; i < emptySquares.length; i++) {
      const currentTest = {};

      currentTest.index = emptySquares[i];

      boardCopy[emptySquares[i]] = mark;

      if (mark === computerMark) {
        const result = minimax(
          currentBoard,
          humanMark,
          humanPlayer,
          computerPlayer,
        );

        currentTest.score = result.score;
      } else {
        const result = minimax(
          boardCopy,
          computerMark,
          humanPlayer,
          computerPlayer,
        );

        currentTest.score = result.score;
      }

      boardCopy[emptySquares[i]] = null;

      testsDone.push(currentTest);
    }

    let bestPlay = null;

    if (mark === computerMark) {
      let bestScore = -Infinity;

      for (let i = 0; i < testsDone.length; i++) {
        if (testsDone[i].score > bestScore) {
          bestScore = testsDone[i].score;
          bestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;

      for (let i = 0; i < testsDone.length; i++) {
        if (testsDone[i].score < bestScore) {
          bestScore = testsDone[i].score;
          bestPlay = i;
        }
      }
    }
    return testsDone[bestPlay];
  }

  function getComputerMove() {
    const emptySquares = getEmptySquares();

    if (emptySquares.length > 7) return Math.floor(Math.random() * 9);

    const computerMark = player2.getMark();

    const bestPlay = minimax(board, computerMark, player1, player2);
    return bestPlay.index;
  }

  function checkDiagonals(row, col) {
    // Check diagonal 1 condition
    if (row === col) currentPlayer.incrementDiagonal1();

    //  Check diagonal 2 condition
    if (+row + +col + 1 === 3) currentPlayer.incrementDiagonal2();
  }

  function endGame(result) {
    if (result === 'win') currentPlayer.incrementScore();

    gamePlay = false;

    displayController.displayResult(result);
  }

  function analyzeBoard(rowIndex, colIndex, cellIndex) {
    if (!gamePlay) return;

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

  function init() {
    displayController.addEventsOnInit();
  }

  return {
    init,
    startGame,
    startGameVSComputer,
    analyzeBoard,
    getMarkToDisplay,
    getComputerMove,
    getCurrentPlayer,
    playNextRound,
    resetAll,
  };
})();

boardState.init();

export default boardState;
