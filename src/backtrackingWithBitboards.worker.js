let counter = 0;
let lastUpdate = 0;
const UPDATE_INTERVAL = 1000000;

const rowBits = [0,0,0,0,0,0,0,0,0];
const colBits = [0,0,0,0,0,0,0,0,0];
const boxBits = [0,0,0,0,0,0,0,0,0];

self.addEventListener('message', function(e) {
    switch (e.data.type) {
        case "start": {
            initBitboards(e.data.level);
            const solution = solve(e.data.level);
            postMessage({ solution, counter });
            break;
        }
        default:
            break;
    }
}, false);

function trackProgress (inputBoard) {
    counter++;
    if (counter - lastUpdate > UPDATE_INTERVAL) {
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

    let [row, col] = getEmptySquare (inputBoard);
    if (row === undefined) {
        return { solved: true, board: inputBoard }
    }
    const box = ~~(row/3)*3 + ~~(col/3);

    let result;
    for (let i = 1; i < 10; i++) {
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


    return { solved: false, board: inputBoard }
}

function getEmptySquare(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i,j]
        }
    }
    return []
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

function isPossibleToSet (row, col, box, number) {
    return (rowBits[row] & (1 << (number - 1))) === 0 &&
            (colBits[col] & (1 << (number - 1))) === 0 &&
            (boxBits[box] & (1 << (number - 1))) === 0;
}