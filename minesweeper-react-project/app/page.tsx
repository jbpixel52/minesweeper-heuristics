"use client";
import { useState } from "react";
import { MinesweeperGame } from "../components/minesweeper";

export default function Home() {
  const [ boardSize, setBoardSize ] = useState(10);
  const [ mineDensity, setMineDensity ] = useState(Math.round(boardSize * 1));
  const [ game, setGame ] = useState(new MinesweeperGame(boardSize, boardSize));
  const [ board, setBoard ] = useState(game.board);
  const [ elements, setElements ] = useState(game.elements);
  const [ iterations, setIterations ] = useState(0);
  const [ errorCount, setErrorCount ] = useState(0);
  const [logElements, setLogElements] = useState(game.logElements)
  const [ nOpened, setOpened ] = useState(0);
  function updateHooks() {
    setBoardSize(game.size);
    setGame(game);
    setBoard(game.board);
    setElements(game.generateElements());
    setIterations(game.iterations)
    setErrorCount(game.errorCount);
    setLogElements(game.logElements);
    setOpened(game.nOpened);
    setIterations(Math.abs(iterations-nOpened))
  }

  function ResetGame() {
    updateHooks()
    setErrorCount(0);
    setLogElements([]);
    // setBoard(game.board);
    // setElements(game.elements);
    setIterations(0)
    setGame(new MinesweeperGame(boardSize, mineDensity));

  }
  function gameBoard() {
         return (<div className={`grid grid-cols-10 content-center space-evenly`}>{elements}</div>);
  }

  return (
    <div>
      <h1>MINESWEEPER SOLVER</h1>

      <div className="p-5 space-x-1 justify-center">
        <p>Errors: {errorCount}</p>
        <p>Iterations: {iterations}</p>
        <button
          className="bg-green-600 border-lime-300 text-black p-3 rounded-xl shadow-md"
          onClick={() => {
            updateHooks()
            game.randomGame();
            updateHooks();
          }}
        >
          {`Solve: Iteration ${iterations}`}
        </button>
        <button
          className="bg-blue-600 border-lime-300 text-black p-3 rounded-xl shadow-md"
          onClick={() => {
            setGame(game);
            game.randomGame(true);
            setBoard(game.board);
            setElements(game.generateElements());
            updateHooks();

            console.log("BEEP BOP!");
            console.log(game);
          }}
        >
          {`Automatic ${iterations}`}
        </button>
        <button
          className="bg-red-300 text-black p-3 rounded-xl shadow-md"
          onClick={()=>ResetGame()}
        >
          Reset Game
        </button>
      </div>

      {gameBoard()}
      <div>
          {logElements}
      </div>
    </div>
  );
}
