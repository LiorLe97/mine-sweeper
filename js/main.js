'use strict'
var firstCellClicked;
var gGame;
var gBoard;
var gLives;
var gGameIntervalId;
var elTimer = document.querySelector('.timer');
var elLives = document.querySelector('.lives')
var elModal = document.querySelector('.modal')
var elVictory = document.querySelector('h2');



function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    clearInterval(gGameIntervalId);
    gStartTime = Date.now();
    elTimer.innerText = '00.000'
    elModal.style.display = 'none';
    firstCellClicked = 0;
    elVictory.style.display = 'none';

    gLives = 3;
    elLives.innerText = `lives:${gLives}`
    gBoard = buildBoard(gLevel.size);

    renderBoard(gBoard, '.board')
}

function chooseBoardSize(elButton) {
    gLevel.size = elButton.getAttribute('data-inside');
    gLevel.mines = elButton.getAttribute('value');
    console.log(gLevel)
    init();
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






function cellClicked(elCell, cellI, cellJ) {
    firstCellClicked++
    if (firstCellClicked === 1) {
        gGameIntervalId = setInterval(updateTimer, 16);
    }
    console.log({ i: cellI, j: cellJ })
    var negCount = setMineNegCount(cellI, cellJ, gBoard);
    console.log('neg mines are ', negCount)
    console.log(gBoard[cellI][cellJ])
    if (gBoard[cellI][cellJ] !== MINE) {
        gBoard[cellI][cellJ].isShown = true
    }
    if (gBoard[cellI][cellJ] === MINE) {
        gLives--
        elLives.innerText = `lives:${gLives}`
    }
    if (gLives === 0) {
        elVictory.innerText = 'YOU EXPLODED';
        gameOver();
    }
    if (gLevel.size === 4) {
        if (firstCellClicked > 14) {
            elVictory.innerText = 'YOU SURVIVED';
            gameOver();
        }
    } else if (gLevel.size === 8) {
        if (firstCellClicked > 52) {
            elVictory.innerText = 'YOU SURVIVED';
            gameOver();
        }
    } else if (gLevel.size === 12) {
        if (firstCellClicked > 114) {
            elVictory.innerText = 'YOU SURVIVED';
            gameOver();
        }
    }

    console.log(gBoard[cellI][cellJ])
    renderBoard(gBoard, '.board')


}
function markCell(elCell,cellI,cellJ,event){
    if(gBoard[cellI][cellJ]===''){
        event.preventDefault();
        gBoard[cellI][cellJ]=FLAG;
    }
    renderBoard(gBoard,'.board')
    console.table(gBoard)
}




function gameOver() {
    console.log('game over')
    clearInterval(gGameIntervalId);
    elModal.style.display = 'inline-block'
    elVictory.style.display = 'block';
}