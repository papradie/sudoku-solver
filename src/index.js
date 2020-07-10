import Worker from './backtracking.worker.js';
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

const statisticsWrapper = document.getElementById('stats');
const originalSudokuWrapper = document.getElementById("original-sudoku");
const solvedSudokuWrapper = document.getElementById("solved-sudoku");

const displayStats = (timeElapsed, visitedNodes) => {
    statisticsWrapper.innerText = `
            Time elapsed: ${timeElapsed}
            Nodes visited: ${visitedNodes}
        `;
};

const run = sudoku => {
    originalSudokuWrapper.appendChild(
        createGui(sudoku)
    );

    const startTime = performance.now();

    const worker = new Worker();
    worker.onmessage = function (event) {
        console.log(`Time: ${(new Date() - startTime)}, Value: ${JSON.stringify(event.data)}`);

        if (event.data.solution) {
            removeChildren(solvedSudokuWrapper);

            solvedSudokuWrapper.appendChild(
                createGui(event.data.solution.board, sudoku, event.data.solution.solved)
            );
        }

        displayStats(performance.now() - startTime, event.data.counter);
    };

    worker.onerror = function (error) {
        console.log(error);
    };

    worker.postMessage({ type: "start", level: sudoku });
};

run(diabolicSudoku);



