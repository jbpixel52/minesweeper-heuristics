type CellStatus = "CLOSED" | "MARKED" | "OPENED";

interface Cell {
  status: CellStatus;
  value: number;
}

interface Board {
  cells: Cell[][];
}

function solveMinesweeper(board: Board): void {
  let changes: number;

  do {
    changes = 0;

    for (let x = 0; x < board.cells.length; x++) {
      for (let y = 0; y < board.cells[ x ].length; y++) {
        changes += deduce(board, x, y);
      }
    }
  } while (changes);
}

function deduce(board: Board, x: number, y: number): number {
  const cell = board.cells[ x ][ y ];

  if (cell.status !== "CLOSED") {
    return 0;
  }

  const neighbors = getNeighbors(board, x, y);
  const closedNeighbors = neighbors.filter(n => n.status === "CLOSED");
  const markedNeighbors = neighbors.filter(n => n.status === "MARKED");

  if (closedNeighbors.length === cell.value - markedNeighbors.length) {
    return assignNeighbors(board, x, y, "CLOSED", "MARKED");
  }

  if (markedNeighbors.length === cell.value) {
    return assignNeighbors(board, x, y, "CLOSED", "OPENED");
  }

  return 0;
}

function getNeighbors(board: Board, x: number, y: number): Cell[] {
  const neighbors: Cell[] = [];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (isValidCell(board, i, j) && !(i === x && j === y)) {
        neighbors.push(board.cells[ i ][ j ]);
      }
    }
  }

  return neighbors;
}

function assignNeighbors(board: Board, x: number, y: number, oldStatus: CellStatus, newStatus: CellStatus): number {
  let changes = 0;

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (isValidCell(board, i, j) && !(i === x && j === y)) {
        const cell = board.cells[ i ][ j ];

        if (cell.status === oldStatus) {
          cell.status = newStatus;
          changes++;
        }
      }
    }
  }

  return changes;
}

function isValidCell(board: Board, x: number, y: number): boolean {
  return x >= 0 && x < board.cells.length && y >= 0 && y < board.cells[ x ].length;
}
