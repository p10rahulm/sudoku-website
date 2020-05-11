function inputfromText(){
    console.log("input from text");
    const textInputDiv = document.getElementById("sudokuTextInput");
    const textinput =textInputDiv.value;
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs = sBox.getElementsByTagName("input");

    console.log("textinput=",textinput);
    for (let i =0;i<Math.min(81,textinput.length);i++){
        sudokuElemDivs[i].value = '';
        if(textinput[i]=='.'){continue;}
        sudokuElemDivs[i].value = textinput[i];
        checkInput(i, textinput[i]);
    }
    console.log("Sudoku = ",Sudoku);
}
// 8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4
function checkInput(id, value) {
    logError("");
    const elemChanged = document.getElementById(id);
    const allowedArray = getAllowedNumbersforIndex(id, Sudoku).toString().split(",");
    const allowed = new Set(allowedArray);

    const valID = Number(id);
    const valNum = Number(value);

    if (!allowed.has(value)) {
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
    } else {
        Sudoku = addInputSudokuHeap(Sudoku, valID, valNum, 0);
    }
    finalInputArray = Sudoku.sudokuInputArray;
}



function addInputSudokuHeap(inputSudoku, inputValID, inputValue, callerFuncLocation = 0,iteration=startIter) {
    const addinputSudokuTS = performance.now()
    const workingAddVal = powerofTwo(inputValue - 1);
    if (callerFuncLocation == 0) {
        inputSudoku.sudokuInputArray[inputValID] = inputValue;
    }


    const [row, col, box] = Game.elemIndices[inputValID];
    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];

    updateAdditionForElemsHeap(inputSudoku, elemsinRow, inputValID, workingAddVal,iteration);
    updateAdditionForElemsHeap(inputSudoku, elemsinCol, inputValID, workingAddVal,iteration);
    updateAdditionForElemsHeap(inputSudoku, elemsinBox, inputValID, workingAddVal,iteration);
    if(inputSudoku.contradiction){return inputSudoku;}

    // inputSudoku.processed[inputValID] =1;
    inputSudoku.workElemArray[inputValID] = workingAddVal;
    iteration.addinputSudokuTT += (performance.now() -  addinputSudokuTS);
    inputSudoku.numProcessed +=1;
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
    if(inputSudoku.contradiction){return inputSudoku;}

    // inputSudoku.processed[inputValID] =1;
    const oldWorkingVal = inputSudoku.workElemArray[inputValID]
    inputSudoku.workElemArray[inputValID] = workingAddVal;
    const numBits = bitCount(oldWorkingVal);
    inputSudoku.workElemIndicesByLength[numBits].delete(inputValID);

    addinputSudokuTT = addinputSudokuTT + (performance.now() -  addinputSudokuTS);
    inputSudoku.numProcessed +=1;
    return inputSudoku;
}

function updateAdditionForElemsHeap(inputSudoku, elemsinSameGroup, inputValID, workingAddVal,iteration=startIter) {
    if(inputSudoku.contradiction){return;}
    const updateAdditionForElemsTS = performance.now();
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex !== inputValID) {
            const oldWorkingVal = inputSudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = inputSudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            inputSudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if(newWorkingVal===0){
                inputSudoku.contradiction = true;
                return inputSudoku;
            }
            if (oldWorkingVal !== newWorkingVal) {
                const newNumbits = bitCount(newWorkingVal);
                if(newNumbits===1){
                    inputSudoku.toProcess.push(currSudokuIndex)
                }
                updateHeap(inputSudoku, currSudokuIndex, newNumbits, newWorkingVal,iteration);
            }
        }
    }
    iteration.updateAdditionForElemsTimeTaken += (performance.now() -  updateAdditionForElemsTS);
}

function updateAdditionForElems(inputSudoku, elemsinSameGroup, inputValID, workingAddVal) {
    if(inputSudoku.contradiction){return;}
    updateAdditionForElemsTS = performance.now();
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex !== inputValID) {
            const oldWorkingVal = inputSudoku.workElemArray[currSudokuIndex];
            const newWorkingVal = inputSudoku.workElemArray[currSudokuIndex] & ~workingAddVal;
            inputSudoku.workElemArray[currSudokuIndex] = newWorkingVal;
            if(newWorkingVal===0){
                inputSudoku.contradiction = true;
                return inputSudoku;
            }
            if (oldWorkingVal !== newWorkingVal) {
                if(isPowerOf2(newWorkingVal)){
                    inputSudoku.toProcess.push(currSudokuIndex)
                }
                updateWEIBL(inputSudoku, currSudokuIndex, oldWorkingVal, newWorkingVal);
            }
        }
    }
    updateAdditionForElemsTimeTaken = updateAdditionForElemsTimeTaken + (performance.now() -  updateAdditionForElemsTS);
}

function deleteInputSudoku(inputSudoku, inputValID, inputValueDeleted,callerFunctionLocation=0) {
    const workingDelVal = powerofTwo(inputValueDeleted - 1);
    let updatingInputWorkingVal = 511;
    console.log("updatingInputWorkingVal=", updatingInputWorkingVal);
    if(callerFunctionLocation===0){
        inputSudoku.sudokuInputArray[inputValID] = 0;
    }


    const [row, col, box] = Game.elemIndices[inputValID];
    const elemsinRow = Game.indicesinRows[row];
    const elemsinCol = Game.indicesinCols[col];
    const elemsinBox = Game.indicesinBoxes[box];

    updatingInputWorkingVal = updateDeletionforElems(inputSudoku, elemsinRow, inputValID, workingDelVal, updatingInputWorkingVal);
    updatingInputWorkingVal = updateDeletionforElems(inputSudoku, elemsinCol, inputValID, workingDelVal, updatingInputWorkingVal);
    updatingInputWorkingVal = updateDeletionforElems(inputSudoku, elemsinBox, inputValID, workingDelVal, updatingInputWorkingVal);

    inputSudoku.workElemArray[inputValID] = updatingInputWorkingVal;
    // inputSudoku.processed[inputValID]=0;
    const numBits = bitCount(updatingInputWorkingVal);
    inputSudoku.workElemIndicesByLength[numBits].add(inputValID);
    inputSudoku.numProcessed -=1;
    return inputSudoku;
}

function updateDeletionforElems(inputSudoku, elemsinSameGroup, inputValID, workingDeleteVal, updatedInputWorkingVal) {
    let updatedInputWorkingVar = updatedInputWorkingVal;
    for (let i = 0; i < elemsinSameGroup.length; i++) {
        const currSudokuIndex = elemsinSameGroup[i];
        if (currSudokuIndex != inputValID) {
            if (!finalInputArray[currSudokuIndex]) {
                const oldWorkingVal = Sudoku.workElemArray[currSudokuIndex];
                const newWorkingVal = Sudoku.workElemArray[currSudokuIndex] | workingDeleteVal;
                inputSudoku.workElemArray[currSudokuIndex] = newWorkingVal;
                if (oldWorkingVal != newWorkingVal) {
                    updateWEIBL(inputSudoku, currSudokuIndex, oldWorkingVal, newWorkingVal);
                }
            } else {
                updatedInputWorkingVar = updatedInputWorkingVar & ~inputSudoku.workElemArray[currSudokuIndex];
            }
        }
    }
    return updatedInputWorkingVar;
}

function updateHeap(sudokuInput, elemID, newNumbits, newWorkingVal,iteration=startIter) {

    const updateWEIBLTimeStart = performance.now();
    const heapValue = newNumbits*100+elemID;
    addToHeap(sudokuInput.workElemIndicesByLength,heapValue);
    iteration.updateWEIBLTimeTaken += (performance.now() -  updateWEIBLTimeStart);
}


function updateWEIBL(sudokuInput, elemID, oldWorkingVal, newWorkingVal) {
    updateWEIBLTimeStart = performance.now();

    const bitCountOld = bitCount(oldWorkingVal);
    sudokuInput.workElemIndicesByLength[bitCountOld].delete(elemID);

    const numBits = bitCount(newWorkingVal);
    // console.log("elemID=",elemID,"numBits=",numBits,"oldWorkingVal=",oldWorkingVal,"newWorkingVal=",newWorkingVal)
    sudokuInput.workElemIndicesByLength[numBits].add(elemID);
    updateWEIBLTimeTaken = updateWEIBLTimeTaken + (performance.now() -  updateWEIBLTimeStart);
}
