'use strict'
const MINE = '🧨';
const FLAG = '🚩';
const HAPPY = '😃'
const DEAD = '🤧'
const KING = '🤴'



//render matrix in html
function renderBoard(board, selector) {
    var cell;
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {

            if (!board[i][j].isShown) {
                cell = ''
            } else {
                cell = (board[i][j].isMine) ? MINE : board[i][j].minesAroundCount
            }


            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td class="' ${className} '" onclick=cellClicked(this,${i},${j}) oncontextmenu=markCell(this,${i},${j},event)>${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function placeMines() {
    var mines = gLevel.mines
    for (var i = 0; i < mines; i++) {
        var randomI = getRandomInt(0, gLevel.size)
        var randomJ = getRandomInt(0, gLevel.size)
        if (gBoard[randomI][randomJ].isMine) i--
            gBoard[randomI][randomJ].isMine = true
    }

}

//create matrix by size
function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell()

        }
    }

    return board;
}


function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true
    }
    return cell

}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


//get an empty cell from that array
function getEmptyCell() {
    var emptyCells = getEmptyCells();
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    var emptyCell = emptyCells[idx];
    return emptyCell;
}

//find empty cells and puts them in array
function getEmptyCells(board) {
    var emptyCellsLoc = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) emptyCellsLoc.push({ i, j })
        }
    }
    return emptyCellsLoc;
}

//get randomint
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var negsCount = countNeighbors(i, j, gBoard)
            gBoard[i][j].minesAroundCount = negsCount
        }
    }
}

//neighbor counter
function countNeighbors(cellI, cellJ, gBoard) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) neighborsCount++

        }
    }
    return neighborsCount
}


// timer
var gStartTime = Date.now();

function updateTimer() {
    var timeDiff = Date.now() - gStartTime;
    var seconds = parseInt(timeDiff / 1000);
    var timeDiffStr = timeDiff.toString();
    var ms = timeDiffStr.substring(timeDiffStr.length - 3);
    if (ms.length < 2) {
        ms = `00${ms}`;
    } else if (ms.length < 3) {
        ms = `0${ms}`;
    }
    if (seconds < 10) seconds = `0${seconds}`;
    document.querySelector('.timer span').innerText = `${seconds}.${ms}`
}