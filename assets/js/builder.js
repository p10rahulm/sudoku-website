/*
    * *******************************
    * NOTES
    * *******************************
    * 1. Each variable = workElem in our working array is represented as a number between 1 and 512.
    * 2. A number that is
 */


class SudokuClass {
    constructor(sudokuInputArray) {
        //sudokuWorkArray contains the 81 variables corresponding to numbers between 1 and 512 (2^9)
        this.sudokuInputArray = sudokuInputArray;
        this.workElemArray = new Array(81).fill(511);
        this.workElemIndicesByLength = [0].concat(Array.from(Array(81), (e, i) => i + 900));

        this.done = false;
        this.toProcess = [];
        this.contradiction = false;
        this.numProcessed = 0;
    }
}

class GameClass {
    constructor() {
        //Integer Division: https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
        this.elemIndices = {}
        for (let i = 0; i < 81; i++) {
            const rowIndex = ~~(i / 9);
            const colIndex = i % 9;
            const squareIndex = ~~(rowIndex / 3) * 3 + ~~(colIndex / 3);
            this.elemIndices[i] = [rowIndex, colIndex, squareIndex];
        }

        //Initialize arrays: Turns out associative marginally faster here

        this.indicesinRows = [];
        this.indicesinCols = [];
        this.indicesinBoxes = [];
        // const indicesinRows = {};
        // const indicesinCols = {};
        // const indicesinBoxes = {};
        for (let i = 0; i < 9; i++) {
            this.indicesinRows[i] = [];
            this.indicesinCols[i] = [];
            this.indicesinBoxes[i] = [];
        }
        for (let i = 0; i < 81; i++) {
            this.indicesinRows[this.elemIndices[i][0]].push(i);
            this.indicesinCols[this.elemIndices[i][1]].push(i);
            this.indicesinBoxes[this.elemIndices[i][2]].push(i);
        }

    }
}

class Iteration {
    constructor(Sudoku) {
        this.startTime = performance.now();
        this.stackdepth = 0;
        this.solutionFound = false;

        this.leastIndexIterationtimeTaken = 0;
        this.copytimetaken = 0;
        this.copyworkElemArrayTT = 0;
        this.copyworkElemIndicesByLengthTT = 0;
        this.copyprocessedTT = 0;
        this.copyinitTT = 0;
        this.copycontradictionTT = 0;
        this.copyTotalTT = 0
        this.updateWEIBLTimeTaken = 0;
        this.updateAdditionForElemsTimeTaken = 0;
        this.addinputSudokuTT = 0;
        this.AddInputTT = 0;
        this.skpushTT = 0;
        this.flTT = 0;
        this.poppingTT = 0;
        this.afterIsDoneTT = 0;
        this.totalRunDFSTT = 0;
        this.nflTT = 0;
        this.AddInputDirectLoopTT = 0;


        this.numIterations = 0;
        this.numLoops = 0;
        this.solutionFound = 0;
        this.solvedSudoku = Sudoku;
    }

}


// Sudoku = new SudokuClass([]);
finalInputArray = [];
sudokuElemOptionsShowing = false;



function start() {
    // buildSudoku();
    drawFirstSudoku();
}

function checkInputDiv(event) {
    clearOptionsDiv();
    checkInput(event.target.id, event.target.value);
}


function buildSudoku() {

    Sudoku = new SudokuClass([]);
    Game = new GameClass();

    startIter = new Iteration(Sudoku);
    // console.log("Sudoku = ", Sudoku);
}
buildSudoku();
function drawFirstSudoku(){
    const sBox = document.getElementById("sudoku-box");
    drawSudoku(Sudoku, sBox, "input");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    setAttributes(sudokuElemDivs);
}


function setAttributes(sudokuElemDivs) {
    for (let i = 0; i < sudokuElemDivs.length; i++) {
        const elemDiv =sudokuElemDivs[i];
        elemDiv.id = i;
        elemDiv.addEventListener("click", createOptions, false);
        elemDiv.addEventListener("change", checkInputDiv, false);
        elemDiv.setAttribute("size",1);
        elemDiv.setAttribute("maxlength",1);
        elemDiv.setAttribute("autocomplete","off");
    }
}


function createNewSudoku(sudokuInputArray) {
    //sudokuWorkArray contains the 81 variables corresponding to numbers between 1 and 512 (2^9)
    const workElemArray = new Array(81);

    const workElemIndicesByLength = {};
    for (let i = 1; i <= 9; i++) {
        workElemIndicesByLength[i] = new Set();
    }

    for (let i = 0; i < 81; i++) {
        if (sudokuInputArray[i] == 0) {
            workElemArray[i] = 511;
            workElemIndicesByLength[9].add(i);
        }
    }

    Sudoku.sudokuInputArray = sudokuInputArray;
    Sudoku.workElemArray = workElemArray;
    Sudoku.workElemIndicesByLength = workElemIndicesByLength;

    Sudoku.done = false;
    // Sudoku.processed = new Array(81).fill(0);
    Sudoku.toProcess = [];
    Sudoku.contradiction = false;
    return Sudoku;
}
