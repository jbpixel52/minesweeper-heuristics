type CellStatus = "CLOSED" | "MARKED" | "OPENED";
type CellValue = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
import { getRandomNumber } from "./helpers";
interface Cell {
  status: CellStatus;
  value: CellValue;
}

interface Board {
  cells: Cell[][];
}

export class MinesweeperGame {
  private board: Board;
  private size: number;
  private minesCount: number;

  constructor(size: number, minesCount: number) {
    this.size = size;
    this.minesCount = minesCount;
    this.board = this.createBoard();
    this.placeMines();
  }

  private createBoard(): Board {
    const cells: Cell[][] = [];

    for (let i = 0; i < this.size; i++) {
      const row: Cell[] = [];

      for (let j = 0; j < this.size; j++) {
        row.push({ status: "CLOSED", value: 0 });
      }

      cells.push(row);
    }

    return { cells };
  }

  private placeMines(): void {
    let minesToPlace = this.minesCount;

    while (minesToPlace > 0) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);

      if (this.board.cells[x][y].value !== -1) {
        this.board.cells[x][y].value = -1;
        minesToPlace--;
      }
    }

    this.calculateValues();
  }

  private calculateValues(): void {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board.cells[x][y].value !== -1) {
          const neighbors = this.getNeighbors(x, y);
          const minesCount = neighbors.filter((n) => n.value === -1).length;
          this.board.cells[x][y].value = minesCount as CellValue;
        }
      }
    }
  }

  private getNeighbors(x: number, y: number): Cell[] {
    const neighbors: Cell[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isValidCell(i, j) && !(i === x && j === y)) {
          neighbors.push(this.board.cells[i][j]);
        }
      }
    }

    return neighbors;
  }

  private isValidCell(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
  public randomPlay(_boardSize: number[]): void {
    const x: number = getRandomNumber(0, _boardSize[0]);
    const y: number = getRandomNumber(0, _boardSize[1]);
    this.play(x, y);
    this.printBoard();
  }
  public randomGame() {
  }
  public renderField(){
    let elements = [];
    this.board.cells.map(cell=>{
      return()
    })
  public play(x: number, y: number): void {
    const cell = this.board.cells[x][y];
    if (cell.status != undefined) {
      if (cell.status === "OPENED") {
        console.log("This cell is already opened.");
        return;
      }

      if (cell.status === "MARKED") {
        console.log("You cannot open a marked cell. Unmark it first.");
        return;
      }

      cell.status = "OPENED";

      if (cell.value === -1) {
        console.log("You stepped on a mine! Game over.");
        // Implement game over logic here...
        return;
      }

      if (cell.value === 0) {
        this.openNeighbors(x, y);
      }
    }

    // Check if the game is won
    if (this.checkWin()) {
      console.log("Congratulations! You won the game.");
      // Implement win logic here...
      return;
    }

    this.printBoard();

    // Apply the heuristic solver
    this.solveWithHeuristic();
  }

  private openNeighbors(x: number, y: number): void {
    const neighbors = this.getNeighbors(x, y);

    for (const neighbor of neighbors) {
      if (neighbor.status === "CLOSED" && neighbor.value !== -1) {
        neighbor.status = "OPENED";

        if (neighbor.value === 0) {
          this.openNeighbors(x, y);
        }
      }
    }
  }

  private checkWin(): boolean {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const cell = this.board.cells[x][y];

        if (cell.status === "CLOSED" && cell.value !== -1) {
          return false;
        }
      }
    }

    return true;
  }

  private solveWithHeuristic(): void {
    const solver = new MinesweeperSolver();
    solver.solve(this.board);
  }

  //   public printBoard(): void {
  //     for (let x = 0; x < this.size; x++) {
  //       let row = "";

  //       for (let y = 0; y < this.size; y++) {
  //         const cell = this.board.cells[x][y];

  //         if (cell.status === "CLOSED") {
  //           row += "▉";
  //         } else if (cell.status === "MARKED") {
  //           row += "M";
  //         } else {
  //           row += cell.value === -1 ? "*" : cell.value;
  //         }

  //         row += " ";
  //       }

  //       console.log(row);
  //     }
  //     console.log ('              ');
  //   }
  //

  public printBoard(): void {
    const tableData: { [key: string]: string }[] = [];

    for (let x = 0; x < this.size; x++) {
      const row: { [key: string]: string } = {};

      for (let y = 0; y < this.size; y++) {
        const cell = this.board.cells[x][y];

        if (cell.status === "CLOSED") {
          row[`Cell ${x}-${y}`] = "▉";
        } else if (cell.status === "MARKED") {
          row[`Cell ${x}-${y}`] = "M";
        } else {
          row[`Cell ${x}-${y}`] = cell.value === -1
            ? "*"
            : cell.value.toString();
        }
      }

      tableData.push(row);
    }

    console.table(tableData);
  }
}

class MinesweeperSolver {
  public solve(board: Board): void {
    let changes: number;

    do {
      changes = 0;

      for (let x = 0; x < board.cells.length; x++) {
        for (let y = 0; y < board.cells[x].length; y++) {
          changes += this.deduce(board, x, y);
        }
      }
    } while (changes);
  }

  private deduce(board: Board, x: number, y: number): number {
    const cell = board.cells[x][y];

    if (cell.status !== "CLOSED") {
      return 0;
    }

    const neighbors = this.getNeighbors(board, x, y);
    const closedNeighbors = neighbors.filter((n) => n.status === "CLOSED");
    const markedNeighbors = neighbors.filter((n) => n.status === "MARKED");

    if (closedNeighbors.length === cell.value - markedNeighbors.length) {
      return this.assignNeighbors(board, x, y, "CLOSED", "MARKED");
    }

    if (markedNeighbors.length === cell.value) {
      return this.assignNeighbors(board, x, y, "CLOSED", "OPENED");
    }

    return 0;
  }

  private getNeighbors(board: Board, x: number, y: number): Cell[] {
    const neighbors: Cell[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isValidCell(board, i, j) && !(i === x && j === y)) {
          neighbors.push(board.cells[i][j]);
        }
      }
    }

    return neighbors;
  }

  private assignNeighbors(
    board: Board,
    x: number,
    y: number,
    oldStatus: CellStatus,
    newStatus: CellStatus,
  ): number {
    let changes = 0;

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isValidCell(board, i, j) && !(i === x && j === y)) {
          const cell = board.cells[i][j];

          if (cell.status === oldStatus) {
            cell.status = newStatus;
            changes++;
          }
        }
      }
    }

    return changes;
  }

  private isValidCell(board: Board, x: number, y: number): boolean {
    return x >= 0 && x < board.cells.length && y >= 0 &&
      y < board.cells[x].length;
  }
}

// Example usage
const boardSize = [10, 10];
const game = new MinesweeperGame(boardSize[0], boardSize[1]);
game.printBoard();
//game.play(0, 0); // Example move
game.randomPlay(boardSize);
game.randomPlay(boardSize);
game.randomPlay(boardSize);

console.log("");

