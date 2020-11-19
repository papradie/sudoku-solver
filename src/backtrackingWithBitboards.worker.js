let counter = 0;
let lastUpdate = 0;
const UPDATE_INTERVAL = 2000000;

const rowBits = [0,0,0,0,0,0,0,0,0];
const colBits = [0,0,0,0,0,0,0,0,0];
const boxBits = [0,0,0,0,0,0,0,0,0];

const empties = [];
let emptyPointer = 0;

self.addEventListener('message', function(e) {
    switch (e.data.type) {
        case "start": {
            initBitboards(e.data.level);
            initEmpties(e.data.level)
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

function solve(inputBoard) {
    trackProgress(inputBoard);

    if (emptyPointer === empties.length) {
        return { solved: true, board: inputBoard }
    }

    let [row, col, candidates] = empties[emptyPointer];
    emptyPointer++;

    const box = ~~(row/3)*3 + ~~(col/3);

    let result;
    for (let j = 0; j < candidates.length; j++) {
        counter++;
        const i = candidates[j];

        if (isPossibleToSet(row, col, box, i)) {
            inputBoard [row][col] = i;
            rowBits[row] |= (1 << (i - 1));
            colBits[col] |= (1 << (i - 1));
            boxBits[box] |= (1 << (i - 1));

            result = solve(inputBoard);
            if ( result.solved) {
                return result;
            }

            rowBits[row] &= ~(1 << (i - 1));
            colBits[col] &= ~(1 << (i - 1));
            boxBits[box] &= ~(1 << (i - 1));
        }
    }

    inputBoard[row][col] = 0;
    emptyPointer--;

    return { solved: false, board: inputBoard }
}

function initEmpties (inputBoard) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (inputBoard[row][col] === 0) {
                const candidates = [];
                const box = ~~(row/3)*3 + ~~(col/3);
                for (let i = 1; i < 10; i++) {
                    if (isPossibleToSet(row, col, box, i)) {
                        candidates.push(i);
                    }
                }

                empties.push([row, col, candidates]);
            }
        }
    }
}

const initBitboards = board => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = board[i][j];

            if (value > 0) {
                rowBits[i] |= (1 << (value - 1));
                colBits[j] |= (1 << (value - 1));
                boxBits[~~(i/3)*3 + ~~(j/3)] |= (1 << (value - 1));
            }
        }
    }
};

function isPossibleToSet (row, col, box, digit) {
    return (rowBits[row] & (1 << (digit - 1))) === 0 &&
            (colBits[col] & (1 << (digit - 1))) === 0 &&
            (boxBits[box] & (1 << (digit - 1))) === 0;
}
