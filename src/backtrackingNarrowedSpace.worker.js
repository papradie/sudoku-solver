
let counter = 0;
let lastUpdate = 0;
const UPDATE_INTERVAL = 2000000;

const empties = [];
let emptyPointer = 0;

self.addEventListener('message', function(e) {
    switch (e.data.type) {
        case "start": {
            initEmpties(e.data.level);
            const solution = solve(e.data.level);
            postMessage({ solution, counter });
            break;
        }
        default:
            break;
    }
}, false);

function trackProgress (inputBoard) {
    //counter++;
    if (counter - lastUpdate >= UPDATE_INTERVAL) {
        lastUpdate = counter;

        postMessage({
            solution: {
                solved: false,
                board: inputBoard
            },
            counter
        });
    }
}

function initEmpties (inputBoard) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (inputBoard[row][col] === 0) {
                const candidates = [];
                for (let i = 1; i < 10; i++) {
                    if (isPossibleToSet(inputBoard, row, col, i)) {
                        candidates.push(i);
                    }
                }

                empties.push([row, col, candidates]);
            }
        }
    }
}

function solve(inputBoard) {
    trackProgress(inputBoard);

    if (emptyPointer === empties.length) {
        return { solved: true, board: inputBoard }
    }

    let [row, col, candidates] = empties[emptyPointer];
    emptyPointer++;

    let result;
    for(let j = 0; j < candidates.length; j++) {
        counter++;
        const i = candidates[j];
        if (isPossibleToSet(inputBoard, row, col, i)) {
            inputBoard [row][col] = i;

            result = solve(inputBoard);
            if ( result.solved) {
                return result;
            }
        }
    }

    inputBoard[row][col] = 0;
    emptyPointer--;
    return { solved: false, board: inputBoard }
}

function isPossibleToSet(board, row, col, number) {

    for (let i = 0; i < 9; i++) {
        if (board[row][i] === number) {
            return false;
        }

        if (board[i][col] === number) {
            return false;
        }
    }

    let rowoffset = Math.floor( row / 3 )*3
    let coloffset = Math.floor( col / 3 )*3
    for (let i = rowoffset; i < rowoffset+3; i++) {
        for (let j = coloffset; j < coloffset+3; j++) {
            if(board[i][j] === number) {
                return false;
            }
        }
    }

    return true;
}
