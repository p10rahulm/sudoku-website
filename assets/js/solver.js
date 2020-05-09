/*
    * We will solve the sudoku using DFS guesses starting with the least index in workElemIndicesByLength
*/

function copySudoku(inputSudoku) {
    const newSudoku = {};
    newSudoku.workElemArray = Object.assign({}, inputSudoku.workElemArray);

    newSudoku.workElemIndicesByLength = {};
    for (let i = 1; i < 10; i++) {
        newSudoku.workElemIndicesByLength[i] = new Set(inputSudoku.workElemIndicesByLength[i]);
    }
    newSudoku.processed = new Set(inputSudoku.processed);
    newSudoku.contradiction=inputSudoku.contradiction;
    return newSudoku;
}

function dfsCreatorSudoku() {
    sudoFirstCopy = copySudoku(Sudoku);
    sudokusHolder = [];
    sudokusHolder.push(sudoFirstCopy);
    runDFSSudoku(sudokusHolder);
}

function runDFSSudoku(sudokuHolder) {
    const runningSudoku = sudokuHolder.pop();
    drawSudoku(runningSudoku);
    console.log("sudokusHolder popped current sudokusHolder = ",sudokusHolder);
    // console.log("sudoku popped  = ",runningSudoku);
    if (isSudokuDone(runningSudoku) || globalDone) {
        return;
    }
    const elemIndicesByLength = runningSudoku.workElemIndicesByLength;
    let leastIndex = 0;
    for (let i = 1; i <= 9 && !leastIndex; i++) {
        // console.log("runningSudoku.workElemIndicesByLength=",runningSudoku.workElemIndicesByLength);
        // console.log("runningSudoku.workElemIndicesByLength[i]=",runningSudoku.workElemIndicesByLength[i]);
        if (runningSudoku.workElemIndicesByLength[i].size !== 0){
            leastIndex = i;
        }
    }
    // console.log("leastIndex = ",leastIndex);

    //get indices:
    const indexToIterate = runningSudoku.workElemIndicesByLength[leastIndex].values().next().value;
    const availableChoices = getAllowedNumbersforIndex(indexToIterate, runningSudoku);
    // console.log("indexToIterate=",indexToIterate);
    // console.log("availableChoices=",availableChoices);
    for (let choiceIndex = 0; choiceIndex < availableChoices.length && !globalDone; choiceIndex++) {
        // console.log("choiceIndex=",choiceIndex);
        const choice = availableChoices[choiceIndex];
        // console.log("choice=",choice);
        const runningSudokuCopy = copySudoku(runningSudoku);
        addInputSudoku(runningSudokuCopy,indexToIterate, choice,1);
        if(!runningSudokuCopy.contradiction){
            sudokusHolder.push(runningSudokuCopy);
        }
        // console.log("sudokusHolder=",sudokusHolder)
    }
    runDFSSudoku(sudokuHolder);
}