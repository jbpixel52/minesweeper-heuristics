"use client";
import { useState } from "react";
import { MinesweeperGame } from "../game/components/minesweeper";

export default function Home() {
  const [boardSize, setBoardSize] = useState(10);
  const [mineDensity, setMineDensity] = useState(Math.round(boardSize * 1));
  const [game, setGame] = useState(new MinesweeperGame(boardSize, boardSize));
  const [board, setBoard] = useState(game.board);
  const [elements, setElements] = useState(game.elements);
  const [iterations, setIterations] = useState(0);

  function ResetGame() {
    setBoardSize(10);
    setGame(new MinesweeperGame(boardSize, mineDensity));
    setBoard(game.board);
    setElements(game.elements);
    setIterations(0)

  }
  function gameBoard() {
    return (
      <div
        className={`grid grid-cols-${boardSize} grid-rows-${boardSize} gap-1`}
      >
        {elements}
      </div>
    );
  }

  return (
    <div className="flex flex-col  justify-center">
      <h1>MINESWEEPER SOLVER</h1>
      <div className="p-5 space-x-1 justify-center">
        <button
          className="bg-yellow-100 text-black p-3 rounded-xl shadow-md"
          onClick={() => {
            game.randomMove();
            setElements(game.generateElements());
            console.log("BEEP BOP!");
          }}
        >
          Random Position Solve
        </button>
        <button
          className="bg-green-600 border-lime-300 text-black p-3 rounded-xl shadow-md"
          onClick={() => {
            setGame(game);
            game.randomGame();
            setBoard(game.board);
            setElements(game.generateElements());
            console.log("BEEP BOP!");
            console.log(game);
            setIterations(iterations+1)
          }}
        >
          {`Solve: Iteration ${iterations}`}
        </button>
        <button
          className="bg-red-300 text-black p-3 rounded-xl shadow-md"
          onClick={ResetGame}
        >
          Reset Game
        </button>
      </div>
      <div className="w-2/3 h-2/3">{gameBoard()}</div>
    </div>
  );
}
