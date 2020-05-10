function createOptions(event) {
    const xPosition = event.clientX;
    const yPosition = event.clientY;
    const inputBoxID = event.target.id;


    const allowedNumbers = getAllowedNumbersforIndex(inputBoxID,Sudoku);

    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    for (let i = 0; i < allowedNumbers.length; i++) {
        let numberDiv = document.createElement("div");
        numberDiv.className = "sudokuElem-number"
        numberDiv.innerHTML = allowedNumbers[i];
        sudokuElemOptionsDiv.appendChild(numberDiv);
        numberDiv.setAttribute("onclick", "setValueofSudokuElemfromNumChoice(" + inputBoxID.valueOf() + "," + allowedNumbers[i].valueOf() + ")");

    }
    // sudokuElemOptionsDiv.style.left =xPosition;
    // sudokuElemOptionsDiv.style.top =yPosition;
    sudokuElemOptionsDiv.classList.add("visibleOptionsList");
    sudokuElemOptionsDiv.classList.remove("invisibleOptionsList");
    sudokuElemOptionsDiv.setAttribute("style", "left: " + xPosition + "px; top: " + yPosition + "px;");

    sudokuElemOptionsShowing = true;
}

function removeChildren(someDiv) {
    while (someDiv.hasChildNodes()) {
        someDiv.removeChild(someDiv.firstChild);
    }
}

function setValueofSudokuElemfromNumChoice(divID, inputValue) {
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    sudokuElemDivs[divID].value = inputValue;
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
    sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
    checkInput(divID, inputValue.toString());
}

function clearOptionsDiv() {
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
    sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
}

function drawSudoku(inputSudoku,holdingBox,type) {
    const outputBoxHolder = document.createElement("div");
    outputBoxHolder.className="gameBox-holder"
    holdingBox.appendChild(outputBoxHolder);
    const outputBox = document.createElement("div");
    outputBox.className="gameBox"
    outputBoxHolder.appendChild(outputBox);
    for (let i=0;i<9;i++){
        const row = document.createElement("div");
        row.className="sudoku-box-row"
        for(let j=0;j<9;j++){
            const currIndex=i*9+j;
            const allowedString = getAllowedNumbersforIndex(currIndex,inputSudoku).join("");
            const elemDiv = document.createElement(type);
            elemDiv.className="input-elem"
            elemDiv.innerHTML=allowedString;
            row.appendChild(elemDiv);
        }
        outputBox.appendChild(row);
    }

    outputBox
}

