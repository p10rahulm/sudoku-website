

function createOptions(event) {
    const xPosition = event.clientX;
    const yPosition = event.clientY;
    const inputBoxID = event.target.id;


    const allowedNumbers = getAllowedNumbersforIndex(inputBoxID);

    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    for (let i=0;i<allowedNumbers.length;i++){
        let numberDiv = document.createElement("div");
        numberDiv.className="sudokuElem-number"
        numberDiv.innerHTML = allowedNumbers[i];
        sudokuElemOptionsDiv.appendChild(numberDiv);
        numberDiv.setAttribute("onclick","setValueofSudokuElemfromNumChoice("+inputBoxID.valueOf()+","+allowedNumbers[i].valueOf()+")");

    }
    // sudokuElemOptionsDiv.style.left =xPosition;
    // sudokuElemOptionsDiv.style.top =yPosition;
    sudokuElemOptionsDiv.classList.add("visibleOptionsList");
    sudokuElemOptionsDiv.classList.remove("invisibleOptionsList");
    sudokuElemOptionsDiv.setAttribute("style", "left: "+xPosition+"px; top: "+yPosition+"px;");

    sudokuElemOptionsShowing = true;
}

function removeChildren(someDiv){
    while (someDiv.hasChildNodes()) {
        someDiv.removeChild(someDiv.firstChild);
    }
}
function setValueofSudokuElemfromNumChoice(divID,inputValue){
    const sBox = document.getElementById("sudoku-box");
    const sudokuElemDivs= sBox.getElementsByTagName("input");
    sudokuElemDivs[divID].value = inputValue;
    const sudokuElemOptionsDiv = document.getElementById("elem-options-holder");
    sudokuElemOptionsDiv.removeAttribute("onclick");
    removeChildren(sudokuElemOptionsDiv);
    sudokuElemOptionsDiv.classList.remove("visibleOptionsList");
    sudokuElemOptionsDiv.classList.add("invisibleOptionsList");
    checkInput(divID,inputValue.toString());
}