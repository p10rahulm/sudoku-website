function logError(message){
    newError = document.createElement("div");
    newError.className = "output-error";
    newError.innerHTML = message;
    const errorsDiv = document.getElementById("output-errors");
    removeChildren(errorsDiv);
    errorsDiv.appendChild(newError);
    // alert(message);
}



function bitCount (n) {
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

function getAllowedNumbersforIndex(index,Sudoku){
    let workingElem = Sudoku.workElemArray[index];
    outNumbers = [];
    for(let i=0;i<9;i++){
        if(workingElem&1==1){
            outNumbers.push(i+1);
        }
        workingElem = workingElem>>1;
    }
    return outNumbers;
}


function isSudokuDone(sudokuInput) {
    if(globalDone){
        return true;
    }
    let done = true;
    for (let i = 2; i <= 9 && done; i++) {
        if (sudokuInput.workElemIndicesByLength[i].size !== 0) {
            done = false;
        }
    }
    if(done===true){
        globalDone=true;
        console.log("sudokuis done! sudokuInput=",sudokuInput)
        drawSudoku(sudokuInput);
    }

    return done;
}