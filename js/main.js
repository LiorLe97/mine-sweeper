'use strict'
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gBoard;
var elTimer = document.querySelector('.timer');
var gTimesClicked;
var gGameIntervalId;
var elRestart = document.querySelector('.restart')



function init() {
    gGame.isOn = true;
    gTimesClicked = 0;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gStartTime = Date.now();
    clearInterval(gGameIntervalId);
    gBoard = buildBoard(gLevel.size)
    console.table(gBoard)
    elRestart.innerText = HAPPY;
    placeMines()
    elTimer.innerText = '00.000'
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board')
}




function chooseBoardSize(elButton) {
    gLevel.size = elButton.getAttribute('data-inside');
    gLevel.mines = elButton.getAttribute('value');
    console.log(gLevel)
    init();
}

function cellClicked(elCell, cellI, cellJ) {
    gTimesClicked++
    if (gTimesClicked === 1) {
        gGameIntervalId = setInterval(updateTimer, 16);
    }
    if (!gGame.isOn) return
    gBoard[cellI][cellJ].isShown = true;
    gGame.shownCount++
    if (gBoard[cellI][cellJ].isMine) {
        renderCell({ i: cellI, j: cellJ }, MINE)
        gameOver();
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true;
                    renderBoard(gBoard, '.board')
                }
            }
        }
    } else {
        if (gBoard[cellI][cellJ].minesAroundCount === 0) {
            expandShown(gBoard, elCell, cellI, cellJ);
        }
        renderCell({ i: cellI, j: cellJ }, gBoard[cellI][cellJ].minesAroundCount)

    }
    console.log('shown count', gGame.shownCount)
    checkVictory()
}



function markCell(elCell, cellI, cellJ, ev) {

    gTimesClicked++
    if (gTimesClicked === 1) {
        gGameIntervalId = setInterval(updateTimer, 16);
    }
    if (!gGame.isOn) return
    ev.preventDefault();
    if (gBoard[cellI][cellJ].isShown) return
    if (gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = false
        renderCell({ i: cellI, j: cellJ }, '')
        gGame.markedCount--;
    } else {
        gBoard[cellI][cellJ].isMarked = true
        renderCell({ i: cellI, j: cellJ }, FLAG)
        gGame.markedCount = gGame.markedCount + 2;

    }
    console.log('marked count', gGame.markedCount)
    checkVictory()
}


function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[cellI].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMarked) continue;
            renderCell({ i: i, j: j }, board[i][j].minesAroundCount);
        }
    }
}


function gameOver() {

    gGame.isOn = false;
    clearInterval(gGameIntervalId)
    elRestart.innerText = DEAD + ' You lost..'
}


function checkVictory() {
    if (gGame.markedCount + gGame.shownCount === gLevel.size * gLevel.size) {
        elRestart.innerText = KING + ' you Won!';
        gGame.isOn = false;
        clearInterval(gGameIntervalId)
    }
}