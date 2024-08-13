function Gameboard() {
  const createBoard = () => {
    return [
      ['','',''],
      ['','',''],
      ['','','']
    ];
  }

  const board = createBoard();

  const getBoard = () => board;

  const placeMarker = (row, column, player) => {
    if (board[row][column] == '') {
      board[row][column] = player;
      return true;
    }
    return false;
  }

  const checkWinner = () => {
    const lines = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ];

    for (const cell of lines) {
      if (cell[0] && cell[0] === cell[1] && cell[0] === cell[2]) {
        return cell[0];
      }
    }

    return null;
  }

  return { getBoard, placeMarker, checkWinner };
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
  const gameBoard = Gameboard();

  const players = [
    {
      name: playerOne,
      marker: 'X'
    },
    {
      name: playerTwo,
      marker: 'O'
    }
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players [0];
  }

  const getActivePlayer = () => activePlayer;

  const checkDraw = () => {
    return gameBoard.getBoard().flat().every(cell => cell !== '');
  }

  const playRound = (row, column) => {
    if (gameBoard.placeMarker(row, column, getActivePlayer().marker)) {
      const winner = gameBoard.checkWinner();
      if (winner) {
        return { status: "win", winner: getActivePlayer().name };
      }
      if (checkDraw()) {
        return {status: "draw" };
      }
      switchPlayer();
      return { status: 'continue', activePlayer: getActivePlayer().name };
    } else {
      return { status: 'invalid' };
    }
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: gameBoard.getBoard
  }
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board')

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name} ходит...`;

    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = rowIndex;
        cell.dataset.column = columnIndex;
        cell.textContent = board[rowIndex][columnIndex];
        boardDiv.appendChild(cell);
      }
    }
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (selectedRow === undefined || selectedColumn === undefined) return;
    const result = game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
     if (result.status === 'win') {
      updateScreen();
      playerTurnDiv.textContent = `${result.winner} победил!`;
    } else if (result.status === 'draw') {
      updateScreen();
      playerTurnDiv.textContent = "Ничья!";
    } else if (result.status === 'invalid') {
      updateScreen();
      playerTurnDiv.textContent = "Неверный ход, попробуйте снова.";
    } else {
      updateScreen();
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();

}

ScreenController();