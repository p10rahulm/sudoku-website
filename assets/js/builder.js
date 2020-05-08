/*
    * *******************************
    * NOTES
    * *******************************
    * 1. Each variable = workElem in our working array is represented as a number between 1 and 512.
    * 2. A number that is
 */
Sudoku ={};
function setIDs(){
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs= sBox.getElementsByTagName("input");
    for(let i = 0;i<sudokuElemDivs.length;i++){
        sudokuElemDivs[i].id = i;
    }
}

function buildSudoku() {
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs= sBox.getElementsByTagName("input");
    const sudokuInputArray = []
    for (let i =0;i<sudokuElemDivs.length;i++){
        sudokuInputArray.push(Number(sudokuElemDivs[i].value));
    }

    const [workElemArray,workElemIndicesByLength] = buildNewSudokuWorkArray(sudokuInputArray);


    const [elemIndices,indicesinRows,indicesinCols,indicesinBoxes] = buildElemIndices();

    createNewSudokuObject(sudokuInputArray,workElemArray,workElemIndicesByLength,
                                        elemIndices,indicesinRows,indicesinCols,indicesinBoxes);
    console.log("Sudoku = ",Sudoku);
}

function createNewSudokuObject(sudokuInputArray,workElemArray,workElemIndicesByLength,
                            elemIndices,indicesinRows,indicesinCols,indicesinBoxes) {
    Sudoku.sudokuInputArray = sudokuInputArray;
    Sudoku.workElemArray = workElemArray;
    Sudoku.workElemIndicesByLength = workElemIndicesByLength;


    Sudoku.elemIndices = elemIndices;
    Sudoku.indicesinRows = indicesinRows;
    Sudoku.indicesinCols = indicesinCols;
    Sudoku.indicesinBoxes = indicesinBoxes;

    Sudoku.done = isSudokuDone(workElemIndicesByLength)
    Sudoku.processed = new Set()
    return Sudoku;
}

function isSudokuDone(workElemIndicesByLength){
    let done = true;
    for(let i =2; i<=9 && done; i++){
        if(workElemIndicesByLength[i].size == 0){
            done = false;
        }
    }
    return done;
}

function buildNewSudokuWorkArray(sudokuInputArray){
    //sudokuWorkArray contains the 81 variables corresponding to numbers between 1 and 512 (2^9)
    const workElemArray = {};
    const workElemIndicesByLength = {};
    for(let i=1;i<=9;i++){
        workElemIndicesByLength[i] = new Set();
    }

    for (let i =0;i<81;i++){
        if(sudokuInputArray[i]==0){
            workElemArray[i] = 511;
            workElemIndicesByLength[9].add(i);
        }
    }
    return [workElemArray,workElemIndicesByLength];
}
function powerofTwo(power){
    return 1<<power;
}
function buildElemIndices() {
    //Integer Division: https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    const elemIndices = {}
    for (let i = 0;i<81;i++){
        const rowIndex = ~~(i/9);
        const colIndex = i%9;
        const squareIndex = ~~(rowIndex/3)*3+~~(colIndex/3);
        elemIndices[i] = [rowIndex,colIndex,squareIndex];
    }

    //Initialize arrays
    const indicesinRows = {};
    const indicesinCols = {};
    const indicesinBoxes = {};
    for (let i = 0;i<9;i++){
        indicesinRows[i] = [];
        indicesinCols[i] = [];
        indicesinBoxes[i] = [];
    }
    for (let i = 0;i<81;i++){
        indicesinRows[elemIndices[i][0]].push(i);
        indicesinCols[elemIndices[i][1]].push(i);
        indicesinBoxes[elemIndices[i][2]].push(i);
    }

    return [elemIndices,indicesinRows,indicesinCols,indicesinBoxes];
}