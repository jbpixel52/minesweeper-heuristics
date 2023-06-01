type CellStatus = "CLOSED" | "MARKED" | "OPENED";
type CellValue = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
import { forEachChild } from "typescript";
import { getRandomNumber } from "./helpers";
interface Cell {
  status: CellStatus;
  value: CellValue;
}

interface Board {
  cells: Cell[][];
}

const propsToSymbol = {
  CLOSED: "🔒",
  OPENED: "🔓",
  MARKED: "🚩",
  0: "0️⃣",
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
};

export class MinesweeperGame {
  public board: Board;
  public size: number;
  public minesCount: number;
  public elements: JSX.Element[];
  public errorCount: number;
  public iterations: number;
  public logElements: JSX.Element[];
  public nOpened: number;
  constructor(size: number, minesCount: number, _board?: Board) {
    this.size = size;
    this.minesCount = minesCount;
    this.board = this.createBoard();
    this.placeMines();
    this.elements = this.generateElements();
    this.errorCount = 0;
    this.iterations = 0;
    this.logElements = [];
    this.nOpened = 0;
    // this.board = typeof(_board)===undefined ? _board : this.createBoard();
  }

  // public exportGame(){
  //   return new MinesweeperGame(this.size, this.minesCount,this.board)
  // }
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

      if (this.board.cells[ x ][ y ].value !== -1) {
        this.board.cells[ x ][ y ].value = -1;
        minesToPlace--;
      }
    }

    this.calculateValues();
  }

  private calculateValues(): void {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board.cells[ x ][ y ].value !== -1) {
          const neighbors = this.getNeighbors(x, y);
          const minesCount = neighbors.filter((n) => n.value === -1).length;
          this.board.cells[ x ][ y ].value = minesCount as CellValue;
        }
      }
    }
  }

  private getNeighbors(x: number, y: number): Cell[] {
    const neighbors: Cell[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isValidCell(i, j) && !(i === x && j === y)) {
          neighbors.push(this.board.cells[ i ][ j ]);
        }
      }
    }

    return neighbors;
  }

  private isValidCell(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
  public randomMove(): void {
    const x: number = getRandomNumber(0, this.size);
    const y: number = getRandomNumber(0, this.size);
    this.play(x, y);
  }

  public randomGame(_automatic:boolean=false): void {
    while (this.checkWin() === false) {
      let x: number = getRandomNumber(0, this.size);
      let y: number = getRandomNumber(0, this.size);
      this.randomMove();
      this.solveWithHeuristic();
      if (this.isValidCell(x, y)) {
        try {
          const cell = this.board.cells[ x ][ y ];
          if (cell.status === "OPENED") {
            console.log("This cell is already opened.");
            this.logElements.push(<p>{"This cell is already opened."}{`${x},${y}`}</p>)
            
            if (_automatic === true) {
              this.iterations = this.iterations + 1;
              this.randomGame();
            }
          }

          if (cell.status === "MARKED") {
            console.log("You cannot open a marked cell. Unmark it first.");
            this.logElements.push(<p>{"You cannot open a marked cell. Unmark it first."}{`${x},${y}` }</p>)

            return;
          }

          cell.status = "OPENED";

          if (cell.value === -1) {
            console.log("You stepped on a mine! Game over.");
            this.logElements.push(<p>{"You stepped on a mine! Game over."}{`${x},${y}` }</p>)

            this.errorCount = this.errorCount + 1;
            console.log(`Mine at [${x},${y}]`);
            this.logElements.push(<p>{`Mine at [${x},${y}]`}{`${x},${y}` }</p>)

            // Implement game over logic here...
            return;
          }

          if (cell.value === 0) {
            this.openNeighbors(x, y);
          }
        } catch (error) {
          //console.error(error);
          console.error("ERROR PLAYING");
        }
      } else {
        this.solveWithHeuristic();
        this.randomGame();
      }

      // Check if the game is won
      if (this.checkWin()) {
        console.log("Congratulations! You won the game.");
        // Implement win logic here...
        return;
      }
    }
  }

  public generateElements() {
    let grid = [];
    let localBoard: Board = this.board;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        let cell: Cell = localBoard.cells[ x ][ y ];
        if (cell.status === "MARKED") {
          grid.push(
            <div className="border-red-500 border-3">
              {propsToSymbol.MARKED}
            </div>
          );
        }
        if (cell.status === "CLOSED") {
          grid.push(
            <div>
              {propsToSymbol.CLOSED}
            </div>
          );
        }
        if (cell.status === "OPENED") {
          if (cell.value === -1 ) { grid.push(<div>💣</div>) }
          else {
            grid.push(
              <div>
                {propsToSymbol[ cell.value ]}
              </div>
            );

          }
        }
      }
    }
    return grid;
  }

  public play(x: number, y: number): void {
    try {
      this.iterations = this.iterations + 1;
      const cell = this.board.cells[ x ][ y ];
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
    } catch (error) {
      //console.error(error);
      console.error("ERROR PLAYING");
    }

    // Check if the game is won
    if (this.checkWin()) {
      console.log("Congratulations! You won the game.");
      // Implement win logic here...
      return;
    }

    //this.printBoard();
    // Apply the heuristic solver
    this.solveWithHeuristic();
  }

  private openNeighbors(x: number, y: number): void {
    const neighbors = this.getNeighbors(x, y);

    for (const neighbor of neighbors) {
      if (neighbor.status === "CLOSED" && neighbor.value !== -1) {
        neighbor.status = "OPENED";
        this.nOpened = this.nOpened + 1;

        if (neighbor.value === 0) {
          this.openNeighbors(x, y);
        }
      }
    }
  }

  private checkWin(): boolean {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const cell = this.board.cells[ x ][ y ];

        if (cell.status === "CLOSED" && cell.value !== -1) {
          return false;
        }
      }
    }

    return true;
  }

  public solveWithHeuristic(): void {
    const solver = new MinesweeperSolver();
    solver.solve(this.board);
  }

  public printBoard(): void {
    for (let x = 0; x < this.size; x++) {
      let row = "";

      for (let y = 0; y < this.size; y++) {
        const cell = this.board.cells[ x ][ y ];

        if (cell.status === "CLOSED") {
          row += "▉";
        } else if (cell.status === "MARKED") {
          row += "M";
        } else {
          row += cell.value === -1 ? "*" : cell.value;
        }

        row += " ";
      }

      console.log(row);
    }
    console.log("              ");
  }
}

class MinesweeperSolver {
  public solve(board: Board): void {
    let changes: number;

    do {
      changes = 0;

      for (let x = 0; x < board.cells.length; x++) {
        for (let y = 0; y < board.cells[ x ].length; y++) {
          changes += this.deduce(board, x, y);
        }
      }
    } while (changes);
  }

  private deduce(board: Board, x: number, y: number): number {
    const cell = board.cells[ x ][ y ];

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
          neighbors.push(board.cells[ i ][ j ]);
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
    newStatus: CellStatus
  ): number {
    let changes = 0;

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.isValidCell(board, i, j) && !(i === x && j === y)) {
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

  private isValidCell(board: Board, x: number, y: number): boolean {
    return (
      x >= 0 && x < board.cells.length && y >= 0 && y < board.cells[ x ].length
    );
  }
}

// Example usage
//const boardSize = 10;
// let mineDensity = getRandomNumber(1, boardSize ^ 2);
// const game = new MinesweeperGame(boardSize, mineDensity);
// game.printBoard();
//game.play(0, 0); // Example move
