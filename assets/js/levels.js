function fillSudk(numToFill, minChoice = 2) {
    let solutionfound = false;
    let attempts = 0;
    // Array.from(document.querySelectorAll('INPUT')).map(x=>x.style.cursor = 'wait');
    document.body.style.cursor = 'wait';
    while (!solutionfound) {
        ++attempts;
        buildSudoku();
        //
        let filled = 0;
        while (filled < numToFill) {
            const elemIndex = getRandomIntBelow(80);
            const allowed = getAllowedNumbersforIndex(elemIndex, Sudoku);
            if (allowed.length < minChoice) {
                continue;
            }
            const arrIndex = getRandomIntBelow(allowed.length);
            const val = allowed[arrIndex];
            addInput(elemIndex, val);
            filled++;
        }
        solutionfound = solutionExists(Sudoku) && checkSolution(Sudoku, minChoice)
    }
    console.log("attempts to generate game:", attempts);
    drawGameSudoku(Sudoku);
    document.body.style.cursor = 'default';
    const timeStart = new Date().getTime();
    setInterval(function () {
        startTimer(timeStart);
    }, 1000);
}

function solutionExists(inputSudoku) {

    let iteration = new Iteration(inputSudoku);
    const sudoFirstCopy = copySudokuHeap(inputSudoku, iteration);
    const sudokusHolder = [];
    sudokusHolder.push(sudoFirstCopy);

    // runDFSSudokuRecursive(sudokusHolder);
    iteration = runDFSSudokuIterativeHeap(sudokusHolder, iteration);
    return iteration.solutionFound
}

function startTimer(timeStart) {
    const dateNow = new Date()
    const timeNow = dateNow.getTime();
    const timeElapsedInSec = ((timeNow - timeStart) / 1000) | 0;
    //https://jsperf.com/math-floor-alternatives
    const days = (timeElapsedInSec / 86400) | 0;
    const hours = (timeElapsedInSec / 3600) | 0;
    const minutes = (timeElapsedInSec / 60) | 0;
    const seconds = (timeElapsedInSec % 60) | 0;
    let outtext = "Time Elapsed: "
    if (days) {
        outtext += days + " days "
    }
    //Format the 0's https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
    if (days || hours) {
        outtext += ("0" + hours).slice(-2) + ":"
    }

    outtext += ("0" + minutes).slice(-2) + ":"
    outtext += ("0" + seconds).slice(-2)
    document.getElementById("timer").innerHTML = outtext;

}

function checkSolution(Sudoku, minChoice) {
    for (let i = 0; i < 81; i++) {
        if (!Sudoku.SudokuPrefill[i] && bitCount(Sudoku.workElemArray[i]) < minChoice) {
            return false;
        }
    }
    return true;
}

function drawGameSudoku() {
    const sBox = document.getElementById("sudoku-box");
    removeChildren(sBox, ["elem-options-holder", "timer"]);
    drawSudoku(Sudoku, sBox, "input");
    const sudokuElemDivs = sBox.getElementsByTagName("input");
    setGameAttributes(sudokuElemDivs);
}

function setGameAttributes(sudokuElemDivs) {
    for (let i = 0; i < sudokuElemDivs.length; i++) {
        const elemDiv = sudokuElemDivs[i];
        elemDiv.id = i;
        if (!elemDiv.classList.contains("pre-filled")) {
            elemDiv.addEventListener("click", createOptions, false);
        }
        // elemDiv.addEventListener("change", checkInputDiv, false);
        elemDiv.setAttribute("size", 1);
        elemDiv.setAttribute("maxlength", 1);
        elemDiv.setAttribute("autocomplete", "off");
        elemDiv.readOnly = true
    }
}

