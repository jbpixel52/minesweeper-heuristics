import { MinesweeperGame } from "../game/components/minesweeper.ts"


const game = new MinesweeperGame(10, 10);
//game.printBoard();

export default function Home() {
  const boardSize = [10, 10];
  return (
    <div>
      <p>MINESWEEPER SOLVER</p>
      <div>
      <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(30px,1fr))]">
        {}
      </div>
      </div>
    </div>
  )
}
