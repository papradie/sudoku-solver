
let counter = 0;
let interimSolution = undefined;
let lastUpdate = 0;
const UPDATE_INTERVAL = 1000000;


self.addEventListener('message', function(e) {

    switch (e.data.type) {
        case "progress": {
            /*postMessage({
                interimSolution, counter
            });*/
            break;
        }
        case "start": {
            const solution = solve(e.data.level);

            postMessage({ solution, counter });
            break;
        }
        default:
            break;
    }


}, false);

function solve(inputBoard) {
    counter++;
    interimSolution = inputBoard;

    if (counter - lastUpdate > UPDATE_INTERVAL) {
        lastUpdate = counter;

        postMessage( counter );
    }

    let [row, col] = getEmptySquare (inputBoard);

    if (row === undefined) {
        return {
            solved: true,
            board:inputBoard
        }
    }

    let result;

    for (let i = 1; i < 10; i++) {
        if (isPossibleToSet(inputBoard, row, col, i)) {
            inputBoard [row][col] = i;

            result = solve(inputBoard);
            if ( result.solved) {
                return result;
            }
        }
    }

    inputBoard[row][col] = 0;
    return {
        solved: false,
        board: inputBoard
    }
}

function getEmptySquare(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i,j]
        }
    }
    return []
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
