import boardState from './board.js';

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

export default displayController;
