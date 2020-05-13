function inputfromText() {
    buildSudoku();
    const sBox = document.getElementById("sudoku-box");
    drawFirstSudoku();
    const textInputDiv = document.getElementById("sudokuTextInput");
    const textinput = textInputDiv.value;
    if (textinput.match("^[0-9.]+$") == null) {
        logError("Please Check the input you have entered");
        return;
    }

    const sudokuElemDivs = sBox.getElementsByTagName("input");

    for (let i = 0; i < Math.min(81, textinput.length); i++) {
        if (textinput[i] == '.') {
            sudokuElemDivs[i].value = '';
            continue;
        }
        sudokuElemDivs[i].value = textinput[i];
        addInput(i, textinput[i]);
    }
}

// 8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4
function addInput(id, value) {
    logError("");
    // const elemChanged = document.getElementById(id);
    // const allowedArray = getAllowedNumbersforIndex(id, Sudoku).toString().split(",");
    // const allowed = new Set(allowedArray);

    const valID = Number(id);
    const valNum = Number(value);
    Sudoku = addInputSudokuHeap(Sudoku, valID, valNum, 0);
    /*
    if (allowed.has(value)) {
        Sudoku = addInputSudokuHeap(Sudoku, valID, valNum, 0);
    } else {
        elemChanged.value = "";
        let alertText;

        //in case valid previous value existed at id fix Sudoku.
        const prevInputValue = Sudoku.sudokuInputArray[valID];
        if (prevInputValue != 0) {
            Sudoku = deleteInputSudoku(Sudoku, valID, prevInputValue);
            console.log("Sudoku =", Sudoku);
            alertText = "Your input: \"" + value + "\" lead to an Error! There was a previous value here: " + prevInputValue + " which is now deleted.";
        } else {
            alertText = "Error! You have input value = '" + value + "'. The allowed values are: " + allowedArray.toString();
        }
        logError(alertText);

    }
    finalInputArray = Sudoku.sudokuInputArray;
     */

}

function removeInput(id, existingValue) {
    logError("");
    const elemChanged = document.getElementById(id);
    elemChanged.value = ""
    Sudoku = deleteInputSudoku(Sudoku, id, existingValue);
    // finalInputArray = Sudoku.sudokuInputArray;
}

function addInputSudokuHeap(inputSudoku, inputValID, inputValue, callerFuncLocation = 0, iteration = startIter) {
    const addinputSudokuTS = performance.now()
    const workingAddVal = powerofTwo(inputValue - 1);


    const [row, col, box] = Game.elemIndices[inputValID];
    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];

    updateAdditionForElemsHeap(inputSudoku, elemsinRow, inputValID, workingAddVal, iteration);
    updateAdditionForElemsHeap(inputSudoku, elemsinCol, inputValID, workingAddVal, iteration);
    updateAdditionForElemsHeap(inputSudoku, elemsinBox, inputValID, workingAddVal, iteration);
    if (inputSudoku.contradiction) {
        return inputSudoku;
    }

    // inputSudoku.processed[inputValID] =1;
    inputSudoku.workElemArray[inputValID] = workingAddVal;
    iteration.addinputSudokuTT += (performance.now() - addinputSudokuTS);
    inputSudoku.numProcessed += 1;
    return inputSudoku;
}

function addInputSudoku(inputSudoku, inputValID, inputValue, callerFuncLocation = 0) {
    addinputSudokuTS = performance.now()
    const workingAddVal = powerofTwo(inputValue - 1);
    if (callerFuncLocation == 0) {
        inputSudoku.sudokuInputArray[inputValID] = inputValue;
    }


    const [row, col, box] = Game.elemIndices[inputValID];
    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];

    updateAdditionForElems(inputSudoku, elemsinRow, inputValID, workingAddVal);
    updateAdditionForElems(inputSudoku, elemsinCol, inputValID, workingAddVal);
    updateAdditionForElems(inputSudoku, elemsinBox, inputValID, workingAddVal);
    if (inputSudoku.contradiction) {
        return inputSudoku;
    }

    // inputSudoku.processed[inputValID] =1;
    const oldWorkingVal = inputSudoku.workElemArray[inputValID]
    inputSudoku.workElemArray[inputValID] = workingAddVal;
    const numBits = bitCount(oldWorkingVal);
    inputSudoku.workElemIndicesByLength[numBits].delete(inputValID);

    addinputSudokuTT = addinputSudokuTT + (performance.now() - addinputSudokuTS);
    inputSudoku.numProcessed += 1;
    return inputSudoku;
}

function updateAdditionForElemsHeap(inputSudoku, elemsinSameGroup, inputValID, workingAddVal, iteration = startIter) {
    if (inputSudoku.contradiction) {
        return;
    }
    const updateAdditionForElemsTS = performance.now();
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex !== inputValID) {
            const oldWorkingVal = inputSudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = inputSudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            inputSudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (newWorkingVal === 0) {
                inputSudoku.contradiction = true;
                return inputSudoku;
            }
            if (oldWorkingVal !== newWorkingVal) {
                const newNumbits = bitCount(newWorkingVal);
                if (newNumbits === 1) {
                    inputSudoku.toProcess.push(currSudokuIndex)
                }
                updateHeap(inputSudoku, currSudokuIndex, newNumbits, newWorkingVal, iteration);
            }
        }
    }
    iteration.updateAdditionForElemsTimeTaken += (performance.now() - updateAdditionForElemsTS);
}

function updateAdditionForElems(inputSudoku, elemsinSameGroup, inputValID, workingAddVal) {
    if (inputSudoku.contradiction) {
        return;
    }
    updateAdditionForElemsTS = performance.now();
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex !== inputValID) {
            const oldWorkingVal = inputSudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = inputSudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            inputSudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if (newWorkingVal === 0) {
                inputSudoku.contradiction = true;
                return inputSudoku;
            }
            if (oldWorkingVal !== newWorkingVal) {
                if (isPowerOf2(newWorkingVal)) {
                    inputSudoku.toProcess.push(currSudokuIndex)
                }
                updateWEIBL(inputSudoku, currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    updateAdditionForElemsTimeTaken = updateAdditionForElemsTimeTaken + (performance.now() - updateAdditionForElemsTS);
}

function deleteInputSudoku(inputSudoku, inputValID, inputValueDeleted) {
    const workingValofItemDeleted = powerofTwo(inputValueDeleted - 1);
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    const valArray = getSudokuInputs(sudokuElemDivs)
    // console.log("sudokuElemDivs=",sudokuElemDivs);
    const [row, col, box] = Game.elemIndices[inputValID];
    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];
    let newWorkingValofID = 511;
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinRow, inputValID, workingValofItemDeleted, newWorkingValofID, valArray);
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinCol, inputValID, workingValofItemDeleted, newWorkingValofID, valArray);
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinBox, inputValID, workingValofItemDeleted, newWorkingValofID, valArray);
    inputSudoku.workElemArray[inputValID] = newWorkingValofID;
    //heap is reset
    resetHeap(inputSudoku, valArray);
    inputSudoku.numProcessed -= 1;
    return inputSudoku;
}

function updateDeletionforElems(inputSudoku, elemsinSameGroup, inputValID, workingValOfItemDeleted, newWorkingValofID, sudokuValueArray) {
    let updatedInputWorkingVar = newWorkingValofID;
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex != inputValID) {
            const currentElemVal = sudokuValueArray[currSudokuIndex];
            if (!currentElemVal) {
                inputSudoku.workElemArray[currSudokuIndex] = inputSudoku.workElemArray[currSudokuIndex] | workingValOfItemDeleted;
            } else {
                const pot = powerofTwo(currentElemVal - 1)
                updatedInputWorkingVar = updatedInputWorkingVar & ~pot;
            }
        }
    }
    return updatedInputWorkingVar;
}

function updateHeap(sudokuInput, elemID, newNumbits, newWorkingVal, iteration = startIter) {

    const updateWEIBLTimeStart = performance.now();
    const heapValue = newNumbits * 100 + elemID;
    addToHeap(sudokuInput.workElemIndicesByLength, heapValue);
    iteration.updateWEIBLTimeTaken += (performance.now() - updateWEIBLTimeStart);
}


function updateWEIBL(sudokuInput, elemID, oldWorkingVal, newWorkingVal) {
    updateWEIBLTimeStart = performance.now();

    const bitCountOld = bitCount(oldWorkingVal);
    sudokuInput.workElemIndicesByLength[bitCountOld].delete(elemID);

    const numBits = bitCount(newWorkingVal);
    // console.log("elemID=",elemID,"numBits=",numBits,"oldWorkingVal=",oldWorkingVal,"newWorkingVal=",newWorkingVal)
    sudokuInput.workElemIndicesByLength[numBits].add(elemID);
    updateWEIBLTimeTaken = updateWEIBLTimeTaken + (performance.now() - updateWEIBLTimeStart);
}

function resetHeap(inputSudoku, valArray) {
    inputSudoku.workElemIndicesByLength = []
    for (let i = 0; i < 81; i++) {
        if (!valArray[i]) {
            const val = inputSudoku.workElemArray[i];
            const numbits = bitCount(val);
            const heapVal = numbits * 100 + i;
            addToHeap(inputSudoku.workElemIndicesByLength, heapVal);
        }

    }
}