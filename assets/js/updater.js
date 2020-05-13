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
    const valID = Number(id);
    const valNum = Number(value);
    Sudoku.SudokuPrefill[valID] = valNum
    Sudoku = addInputSudokuHeap(Sudoku, valID, valNum, 0);


}

function removeInput(id, existingValue) {
    logError("");
    const elemChanged = document.getElementById(id);
    elemChanged.value = ""

    Sudoku = deleteInputSudoku(Sudoku, id);
    // finalInputArray = Sudoku.sudokuInputArray;
}
j=0
function addInputSudokuHeap(inputSudoku, inputValID, inputValue, callerFuncLocation = 0, iteration = startIter) {
    const addinputSudokuTS = performance.now()
    const workingAddVal = powerofTwo(inputValue - 1);
    inputSudoku.workElemArray[inputValID] = workingAddVal;
    const neighbours = Game.neighbours[inputValID];
    updateAdditionForElemsHeap(inputSudoku, neighbours, inputValID, workingAddVal, iteration);
    if (inputSudoku.contradiction) {
        return inputSudoku;
    }
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
            // updateHeap(inputSudoku, currSudokuIndex, newNumbits, newWorkingVal, iteration);
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

function deleteInputSudoku(inputSudoku, inputValID) {
    /*
    const workingValofItemDeleted = powerofTwo(inputValueDeleted - 1);

    const [row, col, box] = Game.elemIndices[inputValID];

    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];
    let newWorkingValofID = 511;
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinRow, inputValID, workingValofItemDeleted, newWorkingValofID);
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinCol, inputValID, workingValofItemDeleted, newWorkingValofID);
    newWorkingValofID = updateDeletionforElems(inputSudoku, elemsinBox, inputValID, workingValofItemDeleted, newWorkingValofID);
     */
    inputSudoku.SudokuPrefill[inputValID] = 0
    const neighbours = Game.neighbours[inputValID];


    inputSudoku.workElemArray[inputValID] = getWVfromSudkFilled(inputSudoku, inputValID);
    const prefilled = inputSudoku.SudokuPrefill
    for (let i = 0; i < neighbours.length; i++) {
        const neighbourIndex = neighbours[i];
        if (prefilled[neighbourIndex]) {
            continue;
        }
        inputSudoku.workElemArray[neighbourIndex] = getWVfromSudkFilled(inputSudoku, neighbourIndex);
    }

    //heap is reset
    // resetHeap(inputSudoku);
    inputSudoku.numProcessed -= 1;
    return inputSudoku;
}

function getWVfromSudkFilled(inputSudoku, inputValID) {
    return getAllowedWorkingVal(Game.neighbours[inputValID], inputSudoku.SudokuPrefill);
}

function getAllowedWorkingVal(neighbours, filledArray) {
    // const nPT = neighbours.map(x=>(filledArray[x])).filter(x => x!==0).map(x=>{return powerofTwo(x-1)});
    //faster: https://stackoverflow.com/questions/34398279/map-and-filter-an-array-at-the-same-time
    // const nPT = neighbours.flatMap(x => (filledArray[x] ? [powerofTwo(filledArray[x] - 1)] : []));
    // console.log("nPT=",nPT);
    // return nPT.reduce(andNot, 511);
    // even faster
    const result = neighbours.reduce(function (accumulator, x, currentIndex, array) {
        return (filledArray[x] ? (accumulator & ~powerofTwo(filledArray[x] - 1)) : accumulator);
    }, 511);
    // console.log("result=",dec2bin(result));
    return result;
}

function andNot(accumulator, num) {
    return accumulator & ~num;
}

function updateDeletionforElems(inputSudoku, elemsinSameGroup, inputValID, workingValOfItemDeleted, newWorkingValofID) {
    let updatedInputWorkingVar = newWorkingValofID;
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex != inputValID) {
            const currentElemVal = inputSudoku.SudokuPrefill[currSudokuIndex];
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

function resetHeap(inputSudoku) {
    inputSudoku.workElemIndicesByLength = []
    for (let i = 0; i < 81; i++) {
        if (!inputSudoku.SudokuPrefill[i]) {
            const val = inputSudoku.workElemArray[i];
            const numbits = bitCount(val);
            const heapVal = numbits * 100 + i;
            addToHeap(inputSudoku.workElemIndicesByLength, heapVal);
        }

    }
}