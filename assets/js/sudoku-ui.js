function createOptions(event) {
    const xPosition = Math.min(event.pageX,window.innerWidth-50);
    const yPosition = event.pageY;
    const inputBoxID = event.target.id;
    const inputVal = event.target.value;
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    if(sudokuElemOptionsDiv.classList.contains("visibleOptionsList")){
        sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
        sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
        return;
    }


    if (event.target.nodeName !== "INPUT" || event.target.type !== "text") {
        return;
    }
    if (inputVal) {
        createRemoveOption(xPosition, yPosition, inputBoxID, inputVal);
    } else {
        createNumberOptions(xPosition, yPosition, inputBoxID);
    }
}


function createNumberOptions(xPosition, yPosition, inputBoxID) {
    const allowedNumbers = getAllowedNumbersforIndex(inputBoxID, Sudoku);

    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    if(allowedNumbers.length===0){
        let numberDiv = document.createElement("div");
        numberDiv.className = "sudokuElem-number";
        numberDiv.innerHTML = "No Options";
        sudokuElemOptionsDiv.appendChild(numberDiv);
    }
    for (let i = 0; i < allowedNumbers.length; i++) {
        let numberDiv = document.createElement("div");
        numberDiv.className = "sudokuElem-number";
        numberDiv.innerHTML = allowedNumbers[i];
        sudokuElemOptionsDiv.appendChild(numberDiv);
        numberDiv.setAttribute("onclick", "setValueofSudokuElemfromNumChoice(" + inputBoxID.valueOf() + "," + allowedNumbers[i].valueOf() + ")");

    }
    sudokuElemOptionsDiv.classList.add("visibleOptionsList");
    sudokuElemOptionsDiv.classList.remove("invisibleOptionsList");
    sudokuElemOptionsDiv.setAttribute("style", "left: " + xPosition + "px; top: " + yPosition + "px;");

}

function createRemoveOption(xPosition, yPosition, inputBoxID, existingValue) {

    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    // sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    let removeDiv = document.createElement("div");
    removeDiv.className = "sudokuElem-number";
    removeDiv.innerHTML = "Remove: " + existingValue;
    sudokuElemOptionsDiv.appendChild(removeDiv);
    removeDiv.setAttribute("onclick", "removeValueofSudokuElemfromNumChoice(" + inputBoxID.valueOf() + "," + existingValue.valueOf() + ")");
    // sudokuElemOptionsDiv.style.left =xPosition;
    // sudokuElemOptionsDiv.style.top =yPosition;
    sudokuElemOptionsDiv.classList.add("visibleOptionsList");
    sudokuElemOptionsDiv.classList.remove("invisibleOptionsList");
    sudokuElemOptionsDiv.setAttribute("style", "left: " + xPosition + "px; top: " + yPosition + "px;");

}

function removeChildren(someDiv, exceptionsArray = []) {
    for (let i = 0; i < someDiv.childNodes.length;) {
        const childIter = someDiv.childNodes[i];
        if (exceptionsArray.indexOf(childIter.id) === -1) {
            someDiv.removeChild(childIter);
        } else {
            i++;
        }
    }
}

function setUIonOptionClick() {
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
    sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
}

function setValueofSudokuElemfromNumChoice(divID, inputValue) {
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    sudokuElemDivs[divID].value = inputValue;
    setUIonOptionClick();
    // console.log("adding stuff");
    // console.log("Sudoku.PreFill = ",Sudoku.SudokuPrefill);
    // console.log("Sudoku.workElemArray = ",Sudoku.workElemArray);
    addInput(divID, inputValue.toString());
    // console.log("after adding");
    // console.log("Sudoku.PreFill = ",Sudoku.SudokuPrefill);
    // console.log("Sudoku.workElemArray = ",Sudoku.workElemArray);
    //Check if Sudoku is Done!
    checkGameOver();

}


function removeValueofSudokuElemfromNumChoice(divID, existingValue) {
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    sudokuElemDivs[divID].value = "";
    setUIonOptionClick();
    console.log("removing stuff");
    console.log("Sudoku.PreFill = ",Sudoku.SudokuPrefill);
    console.log("Sudoku.workElemArray = ",Sudoku.workElemArray);
    removeInput(divID, existingValue);
    console.log("after removal");
    console.log("Sudoku.PreFill = ",Sudoku.SudokuPrefill);
    console.log("Sudoku.workElemArray = ",Sudoku.workElemArray);
}

function clearOptionsDiv() {
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
    sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
}

function drawSudoku(inputSudoku, holdingBox, type) {
    const outputBoxHolder = document.createElement("div");
    outputBoxHolder.className = "gameBox-holder";
    holdingBox.appendChild(outputBoxHolder);
    const outputBox = document.createElement("div");
    outputBox.className = "gameBox";
    outputBoxHolder.appendChild(outputBox);
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("div");
        row.className = "sudoku-box-row";
        for (let j = 0; j < 9; j++) {
            const currIndex = i * 9 + j;

            const elemDiv = document.createElement(type);
            elemDiv.className = "input-elem";
            if (i === 0) {
                elemDiv.classList.add("outer-top");
            }
            if (i === 2 || i === 5) {
                elemDiv.classList.add("inner-bottom");
            }
            if (i === 3 || i === 6) {
                elemDiv.classList.add("inner-top");
            }

            if (i === 8) {
                elemDiv.classList.add("outer-bottom");
            }
            if (j === 0) {
                elemDiv.classList.add("outer-left");
            }
            if (j === 2 || j === 5) {
                elemDiv.classList.add("inner-right");
            }
            if (j === 3 || j === 6) {
                elemDiv.classList.add("inner-left");
            }
            if (j === 8) {
                elemDiv.classList.add("outer-right");
            }
            if (type === "div") {
                elemDiv.innerHTML = getAllowedNumbersforIndex(currIndex, inputSudoku).join("");
            } else {
                const preFill = inputSudoku.SudokuPrefill[currIndex];
                if (preFill) {
                    elemDiv.value = preFill;
                    elemDiv.classList.add("pre-filled");
                }

            }
            row.appendChild(elemDiv);
        }
        outputBox.appendChild(row);
    }
}

function toggleDisplay(divID) {
    divtoToggle = document.getElementById(divID);
    if (divtoToggle.classList.contains("active")) {
        divtoToggle.classList.remove("active");
        divtoToggle.classList.add("inactive");
        divtoToggle.innerText.replace("Enter", "Hide");
        divtoToggle.innerText.replace("see", "hide");
    } else if (divtoToggle.classList.contains("inactive")) {
        divtoToggle.classList.remove("inactive");
        divtoToggle.classList.add("active");
        divtoToggle.innerText.replace("Enter", "Hide");
        divtoToggle.innerText.replace("see", "hide");
    }
}

function getSudokuInputs(sudokuElemDivs) {
    return Array.from(sudokuElemDivs).map(x => {
        return Number(x.value)
    });
}

