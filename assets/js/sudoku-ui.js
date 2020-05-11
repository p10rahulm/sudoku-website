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
            if(i==0){elemDiv.classList.add("outer-top");}
            if(i==2||i==5){elemDiv.classList.add("inner-bottom");}
            if(i==3||i==6){elemDiv.classList.add("inner-top");}

            if(i==8){elemDiv.classList.add("outer-bottom");}
            if(j==0){elemDiv.classList.add("outer-left");}
            if(j==2||j==5){elemDiv.classList.add("inner-right");}
            if(j==3||j==6){elemDiv.classList.add("inner-left");}
            if(j==8){elemDiv.classList.add("outer-right");}
            if(type=="div"){
                elemDiv.innerHTML=allowedString;
            } else {
                elemDiv.setAttribute("size",1);
                elemDiv.setAttribute("maxlength",1);
                elemDiv.setAttribute("autocomplete","off");
            }

            row.appendChild(elemDiv);
        }
        outputBox.appendChild(row);
    }

    outputBox
}

