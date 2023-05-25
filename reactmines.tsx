import React, { useState, useEffect } from 'react';

// Constants for cell status
enum CellStatus {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  FLAGGED = 'flagged',
}

// Interface for cell data
interface Cell {
  status: CellStatus;
  value: number;
}

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);

  // Function to initialize the game board
  const initializeBoard = (): void => {
    // Initialize an empty board with hidden cells
    const newBoard: Cell[][] = [];
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        row.push({ status: CellStatus.HIDDEN, value: 0 });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  };

  // Function to generate mines randomly on the board
  const generateMines = (): void => {
    // Clear the board
    initializeBoard();

    // Generate mines randomly
    const newBoard = [...board];
    for (let i = 0; i < 10; i++) {
      let x = Math.floor(Math.random() * 8);
      let y = Math.floor(Math.random() * 8);
      // Check if the cell already contains a mine
      if (newBoard[x][y].value === -1) {
        i--;
        continue;
      }
      // Set the cell value to -1 to represent a mine
      newBoard[x][y].value = -1;
    }
    setBoard(newBoard);
  };

  // Function to reveal a cell
  const revealCell = (x: number, y: number): void => {
    if (board[x][y].status === CellStatus.REVEALED) {
      return;
    }

    const newBoard = [...board];
    newBoard[x][y].status = CellStatus.REVEALED;

    if (newBoard[x][y].value === 0) {
      // Reveal all adjacent cells if the cell value is 0
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (i >= 0 && i < 8 && j >= 0 && j < 8 && newBoard[i][j].status !== CellStatus.REVEALED) {
            revealCell(i, j);
          }
        }
      }
    }

    setBoard(newBoard);
  };

  // Function to handle cell right-click event
  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number): void => {
    e.preventDefault();

    if (board[x][y].status === CellStatus.HIDDEN) {
      const newBoard = [...board];
      newBoard[x][y].status = CellStatus.FLAGGED;
      setBoard(newBoard);
    } else if (board[x][y].status === CellStatus.FLAGGED) {
      const newBoard = [...board];
      newBoard[x][y].status = CellStatus.HIDDEN;
      setBoard(newBoard);
    }
  };

  // Function to render the game board
  const renderBoard = (): JSX.Element[] => {
    const cells: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = board[i][j];
        cells.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${cell.status}`}
            onClick={() => revealCell(i, j)}
            onContextMenu={(e) => handleCellRightClick(e, i, j)}
          >
            {cell.status === CellStatus.REVEALED && cell.value !== 0 && cell.value !== -1 && cell.value}
            {cell.status === CellStatus.FLAGGED && '🚩'}
          </div>
        );
      }
    }
    return cells;
  };

  // Initialize the game board on component mount
  useEffect(() => {
    generateMines();
  }, []);

  return (
    <div className="minesweeper">
      <div className="board">{renderBoard()}</div>
      <button className="reset-button" onClick={generateMines}>
        Reset
      </button>
    </div>
  );
};

export default Minesweeper;
