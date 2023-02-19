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

export default Player;
