function checkInput(id, value) {
    const elemChanged = document.getElementById(id);
    const allowed = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

    const valID = Number(id);
    const valNum = Number(value);

    if (!allowed.has(value)) {
        const alertText = "Error! You have input value = '" + value + "'. Please add values between [1-9]";
        elemChanged.value = "";
        logError(alertText);
        //in case valid previous value existed at id fix Sudoku.
        if (Sudoku.sudokuInputArray[valID] != 0) {
            deleteInputSudoku(valID, Sudoku.sudokuInputArray[valID]);
            console.log("Sudoku =", Sudoku);
            return
        }

    }
    addInputSudoku(valID, valNum);
    console.log("Sudoku =", Sudoku);
}

function addInputSudoku(inputValID, inputValue) {
    const workingAddVal = powerofTwo(inputValue - 1);
    Sudoku.sudokuInputArray[inputValID] = inputValue;


    const [row, col, box] = Sudoku.elemIndices[inputValID];
    const elemsinRow = Sudoku.indicesinRows[row];
    const elemsinCol = Sudoku.indicesinCols[col];
    const elemsinBox = Sudoku.indicesinBoxes[box];

    for (let i = 0; i < elemsinRow.length; i++) {
        const currSudokuIndex = elemsinRow[i];
        if (currSudokuIndex != inputValID) {
            const currWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (currWorkingVal != newWorkingVal) {
                decWEIBL(currSudokuIndex);
            }
        }
    }
    for (let i = 0; i < elemsinCol.length; i++) {
        const currSudokuIndex = elemsinCol[i];
        if (currSudokuIndex != inputValID) {
            const currWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (currWorkingVal != newWorkingVal) {
                decWEIBL(currSudokuIndex);
            }
        }
    }
    for (let i = 0; i < elemsinBox.length; i++) {
        const currSudokuIndex = elemsinBox[i];
        if (currSudokuIndex != inputValID) {
            const currWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (currWorkingVal != newWorkingVal) {
                decWEIBL(currSudokuIndex);
            }
        }
    }

    Sudoku.processed.add(inputValID);
    const oldWorkingVal = Sudoku.workElemArray[inputValID]
    Sudoku.workElemArray[inputValID] = workingAddVal;
    const numBits = bitCount(oldWorkingVal);
    Sudoku.workElemIndicesByLength[numBits].delete(inputValID);
}


function deleteInputSudoku(inputValID, inputValueDeleted) {
    const workingDelVal = powerofTwo(inputValueDeleted - 1);
    let newInputWorkingVal = 511;
    Sudoku.sudokuInputArray[inputValID] = 0;

    const [row, col, box] = Sudoku.elemIndices[inputValID];
    const elemsinRow = Sudoku.indicesinRows[row];
    const elemsinCol = Sudoku.indicesinCols[col];
    const elemsinBox = Sudoku.indicesinBoxes[box];

    for (let i = 0; i < elemsinRow.length; i++) {
        const currSudokuIndex = elemsinRow[i];
        if (currSudokuIndex != inputValID) {
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] | workingDelVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            newInputWorkingVal = newInputWorkingVal & ~newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                incWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    for (let i = 0; i < elemsinCol.length; i++) {
        if (currSudokuIndex != inputValID) {
            const currSudokuIndex = elemsinCol[i];
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] | workingDelVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            newInputWorkingVal = newInputWorkingVal & ~newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                incWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    for (let i = 0; i < elemsinBox.length; i++) {
        if (currSudokuIndex != inputValID) {
            const currSudokuIndex = elemsinBox[i];
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] | workingDelVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            newInputWorkingVal = newInputWorkingVal & ~newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                incWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    Sudoku.workElemArray[inputValID] = newInputWorkingVal;
    Sudoku.processed.delete(inputValID);
    const numBits = bitCount(newInputWorkingVal);
    Sudoku.workElemIndicesByLength[numBits].add(inputValID);
}

function incWEIBL(elemID, oldWorkingVal, newWorkingVal) {
    if (Sudoku.processed.has(elemID)) {
        Sudoku.processed.delete(elemID);
    } else {
        const bitCountOld = bitCount(oldWorkingVal);
        Sudoku.workElemIndicesByLength[bitCountOld].delete(elemID);
    }

    const numBits = bitCount(newWorkingVal);
    Sudoku.workElemIndicesByLength[numBits].add(elemID);
}

function decWEIBL(elemID) {
    let lengthFound = false;
    for (let i = 9; i > 1 && !lengthFound; i--) {
        //Note we are looping only upto length 2 here, if we don't find it till 2, there's nothing to do in length 1
        if (Sudoku.workElemIndicesByLength[i].has(elemID)) {
            Sudoku.workElemIndicesByLength[i].delete(elemID);
            Sudoku.workElemIndicesByLength[i - 1].add(elemID);
            lengthFound = true;
        }
    }
}

function resetWorkingValforID(inputValID) {
    let WorkingVal = 511;
    const [row, col, box] = Sudoku.elemIndices[inputValID];
    const elemsinRow = Sudoku.indicesinRows[row];
    const elemsinCol = Sudoku.indicesinCols[col];
    const elemsinBox = Sudoku.indicesinBoxes[box];

    for (let i = 0; i < elemsinRow.length; i++) {
        const currSudokuIndex = elemsinRow[i];
        if (currSudokuIndex != inputValID) {
            WorkingVal = WorkingVal & ~Sudoku.workElemArray[currSudokuIndex]
        }
    }
    Sudoku.sudokuInputArray[inputValID] = 0;
}