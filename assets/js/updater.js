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
        }
    } else{
        addInputSudoku(valID, valNum);
        console.log("Sudoku =", Sudoku);
    }

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
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                updateWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    for (let i = 0; i < elemsinCol.length; i++) {
        const currSudokuIndex = elemsinCol[i];
        if (currSudokuIndex != inputValID) {
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                updateWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    for (let i = 0; i < elemsinBox.length; i++) {
        const currSudokuIndex = elemsinBox[i];
        if (currSudokuIndex != inputValID) {
            const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (oldWorkingVal != newWorkingVal) {
                updateWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
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
    let updatingInputWorkingVal = 511;
    console.log("updatingInputWorkingVal=", updatingInputWorkingVal);
    Sudoku.sudokuInputArray[inputValID] = 0;

    const [row, col, box] = Sudoku.elemIndices[inputValID];
    const elemsinRow = Sudoku.indicesinRows[row];
    const elemsinCol = Sudoku.indicesinCols[col];
    const elemsinBox = Sudoku.indicesinBoxes[box];

    updatingInputWorkingVal = updateDeletionforElems(elemsinRow, inputValID, workingDelVal, updatingInputWorkingVal);
    updatingInputWorkingVal = updateDeletionforElems(elemsinCol, inputValID, workingDelVal, updatingInputWorkingVal);
    updatingInputWorkingVal = updateDeletionforElems(elemsinBox, inputValID, workingDelVal, updatingInputWorkingVal);

    Sudoku.workElemArray[inputValID] = updatingInputWorkingVal;
    Sudoku.processed.delete(inputValID);
    const numBits = bitCount(updatingInputWorkingVal);
    Sudoku.workElemIndicesByLength[numBits].add(inputValID);
}

function updateDeletionforElems(elemsinSameGroup, inputValID, workingDeleteVal, updatedInputWorkingVal) {
    let updatedInputWorkingVar = updatedInputWorkingVal;
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex != inputValID) {
            if (!Sudoku.sudokuInputArray[currSudokuIndex]) {
                const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
                const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] | workingDeleteVal;
                Sudoku.workElemArray[currSudokuIndex] = newWorkingVal;
                if (oldWorkingVal != newWorkingVal) {
                    updateWEIBL(currSudokuIndex, oldWorkingVal, newWorkingVal);
                }
            } else {
                updatedInputWorkingVar = updatedInputWorkingVar & ~Sudoku.workElemArray[currSudokuIndex];
            }
        }
    }
    return updatedInputWorkingVar;
}

function updateWEIBL(elemID, oldWorkingVal, newWorkingVal) {
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
