import Worker from './backtracking.worker.js';
import NarrowedWorker from './backtrackingNarrowedSpace.worker';
import BitboardWorker from './backtrackingWithBitboards.worker';
import { createGui, removeChildren } from './gui';
import css from './main.css';

const sudoku01 = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const normalSudoku =
    [[0, 0, 4, 3, 0, 0, 2, 0, 9],
    [0, 0, 5, 0, 0, 9, 0, 0, 1],
    [0, 7, 0, 0, 6, 0, 0, 4, 3],
    [0, 0, 6, 0, 0, 2, 0, 8, 7],
    [1, 9, 0, 0, 0, 7, 4, 0, 0],
    [0, 5, 0, 0, 8, 3, 0, 0, 0],
    [6, 0, 0, 0, 0, 0, 1, 0, 5],
    [0, 0, 3, 5, 0, 8, 6, 9, 0],
    [0, 4, 2, 9, 1, 0, 3, 0, 0]
];

const diabolicSudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 8, 5],
    [0, 0, 1, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 7, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 1, 0, 0],
    [0, 9, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 7, 3],
    [0, 0, 2, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 9],
];

const displayStats = (wrapper, timeElapsed, visitedNodes) => {
    wrapper.innerText = `
            Time (milliseconds): ${Math.floor(timeElapsed)}
            Nodes visited: ${visitedNodes}
        `;
};

const initSudoku = (prefix, sudoku, worker) => {
    document.getElementById(prefix + "-original-sudoku").appendChild(
        createGui(sudoku)
    );
    document.getElementById(prefix + "-start").onclick = function() {
        run(prefix, sudoku, worker);
    };
};

const run = (prefix, sudoku, worker) => {
    const statisticsWrapper = document.getElementById(prefix + '-stats');
    const solvedSudokuWrapper = document.getElementById(prefix + "-solved-sudoku");

    const startTime = performance.now();

    worker.onmessage = function (event) {
        if (event.data.solution) {
            removeChildren(solvedSudokuWrapper);
            solvedSudokuWrapper.appendChild(
                createGui(event.data.solution.board, sudoku, event.data.solution.solved)
            );

            if (event.data.solution.solved) {
                worker.terminate();
            }
        }

        displayStats(statisticsWrapper,performance.now() - startTime, event.data.counter);
    };

    worker.onerror = function (error) {
        console.log(error);
    };

    worker.postMessage({ type: "start", level: sudoku });
};

initSudoku('backtracking', diabolicSudoku, new Worker());
initSudoku('bns-backtracking', diabolicSudoku, new NarrowedWorker());
initSudoku('bb-backtracking', diabolicSudoku, new BitboardWorker());




