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

  const printBoard = () => {
    console.log(board.map(function(row) {
      return row.join(' | ');
    }).join('\n'));
  }

  return { getBoard, placeMarker, printBoard };
}


