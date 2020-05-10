function logError(message){
    if(message==""){
        const errorsDiv = document.getElementById("output-errors");
        removeChildren(errorsDiv);
        return;
    }
    newError = document.createElement("div");
    newError.className = "output-error";
    newError.innerHTML = message;
    newErrorHeading = document.createElement("div");
    newErrorHeading.className = "output-heading";
    newErrorHeading.innerHTML = "Error Message";
    const errorsDiv = document.getElementById("output-errors");
    removeChildren(errorsDiv);
    errorsDiv.appendChild(newErrorHeading);
    errorsDiv.appendChild(newError);
    // alert(message);
}

function isPowerOf2(someNum) {
    return someNum && !(someNum & (someNum - 1));
}

function getlog2for2Power(someNum) {
    switch (someNum) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 3;
        case 8:
            return 4;
        case 16:
            return 5;
        case 32:
            return 6;
        case 64:
            return 7;
        case 128:
            return 8;
        case 256:
            return 9;
    }
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
    return done;
}