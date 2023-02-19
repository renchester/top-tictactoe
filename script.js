'use strict';

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

  function getEmptySquares(boardArray = board) {
    const emptyIndices = [];

    // Store empty slots in an array
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === null) emptyIndices.push(i);
    }

    return emptyIndices;
  }

  function getComputerMove() {
    const emptySquares = getEmptySquares();

    if (emptySquares.length > 7) return Math.floor(Math.random() * 9);

    const computerMark = player2.getMark();

    const bestPlay = minimax(board, computerMark, player1, player2);
    console.log(bestPlay);
    return bestPlay.index;
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

    // console.log(testsDone);

    return testsDone[bestPlay];
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
    } else if (board.every((item) => item !== null)) {
      return 'tie';
    } else {
      return false;
    }
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

  const winnerOverlay = document.querySelector('.display-winner');
  const winnerText = document.querySelector('.display-winner--text');
  const btnPlayAgain = document.querySelector('.btn-play-again');
  const btnBack = document.querySelector('.btn-back');

  function hideEl(el) {
    el.classList.add('hidden');
  }

  function showEl(el) {
    el.classList.remove('hidden');
  }

  function generateMove() {
    // Generate a move
    const computerMove = boardState.getComputerMove();
    const computerChoice = [...cells].find(
      (cell) => +cell.dataset.id === +computerMove,
    );

    if (!computerChoice) return;

    const columnOfChoice = +computerChoice.dataset.column;
    const rowOfChoice = +computerChoice.dataset.row;
    const choiceID = +computerChoice.dataset.id;

    // Print to board
    computerChoice.textContent = boardState.getMarkToDisplay();
    computerChoice.removeEventListener('click', printMove);

    // Save computer move to board state
    // boardState.getComputerMove();
    boardState.analyzeBoard(rowOfChoice, columnOfChoice, choiceID);
  }

  function printMove(e) {
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.column;
    const cell = +e.target.dataset.id;

    // Print move and remove listener so cell can only be clicked once
    e.target.textContent = boardState.getMarkToDisplay();
    e.target.removeEventListener('click', printMove);

    // Save move to boardState
    boardState.analyzeBoard(row, col, cell);

    // Run when playing against computer
    if (!boardState.getCurrentPlayer().isHuman()) {
      generateMove();
      return;
    }

    scoresheet1.classList.toggle('scoresheet--player-active');
    scoresheet2.classList.toggle('scoresheet--player-active');
  }

  function renderScoresheet(player1, player2) {
    scoresheet1.querySelector('.scoresheet--player-name').textContent = player1;
    scoresheet2.querySelector('.scoresheet--player-name').textContent = player2;

    // Change icon to computer
    if (player2 === 'Computer') {
      scoresheet2.querySelector('.scoresheet--icon').textContent = 'smart_toy';
    }

    // Default icon
    if (player2 !== 'Computer') {
      scoresheet2.querySelector('.scoresheet--icon').textContent = 'face';
    }
  }

  function updateScoresheet() {
    const currentPlayer = boardState.getCurrentPlayer();

    if (name1.textContent === currentPlayer.getName()) {
      score1.textContent = currentPlayer.getScore();
    } else if (name2.textContent === currentPlayer.getName()) {
      score2.textContent = currentPlayer.getScore();
    }
  }

  function resetScoresheet() {
    scoresheet1.querySelector('.scoresheet--player-score').textContent = 0;
    scoresheet2.querySelector('.scoresheet--player-score').textContent = 0;
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
    renderScoresheet(player1, player2);
  }

  function showBoardVSComputer() {
    boardState.startGameVSComputer();

    hideEl(selectScreen);
    showEl(board);
    showEl(scoresheet1);
    showEl(scoresheet2);

    renderScoresheet('Human', 'Computer');
  }

  function displayResult(result) {
    showEl(winnerOverlay);

    cells.forEach((cell) => cell.removeEventListener('click', printMove));

    showEl(btnPlayAgain);

    if (result === 'win') {
      winnerText.textContent = `${boardState
        .getCurrentPlayer()
        .getName()} wins!`;

      updateScoresheet();
    } else if (result === 'tie') winnerText.textContent = "It's a draw!";
  }

  function addEventsOnInit() {
    versusPlayer.addEventListener('click', showNameInputScreen);
    versusAI.addEventListener('click', showBoardVSComputer);
    btnStart.addEventListener('click', showBoard);
  }

  function addEventsOnBoard() {
    cells.forEach((cell) => cell.addEventListener('click', printMove));
    btnPlayAgain.addEventListener('click', boardState.playNextRound);
    btnBack.addEventListener('click', boardState.resetAll);
  }

  function resetBoard() {
    cells.forEach((cell) => (cell.textContent = ''));

    hideEl(btnPlayAgain);
    hideEl(winnerOverlay);
    addEventsOnBoard();
  }

  function resetToStart() {
    resetBoard();
    hideEl(board);
    showEl(selectScreen);
    addEventsOnInit();
  }

  return {
    addEventsOnBoard,
    addEventsOnInit,
    displayResult,
    generateMove,
    resetBoard,
    resetToStart,
    resetScoresheet,
  };
})();

const Player = (givenName, givenMark, isAlive = true) => {
  const name = givenName;
  const mark = givenMark;
  const sentience = isAlive;

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
  const isHuman = () => sentience;

  function incrementRow(index) {
    rowArr[index]++;
  }

  function incrementColumn(index) {
    columnArr[index]++;
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
    isHuman,
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
