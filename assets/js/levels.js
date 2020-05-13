function fillSudk(numToFill, level = 1) {
    gameLevel = level
    let solutionfound = false;
    let attempts = 0;
    // Array.from(document.querySelectorAll('INPUT')).map(x=>x.style.cursor = 'wait');
    document.body.style.cursor = 'wait';
    UNIQSUDOKUSIZE = 17
    MINBRANCHUS = 3
    let solution, solutionExistsBool
    while (!solutionfound) {
        ++attempts;
        buildSudoku();
        //
        let filled = 0;
        const filledIndices = new Set();
        while (filled < UNIQSUDOKUSIZE) {
            const elemIndex = getRandomIntBelow(80);
            const allowed = getAllowedNumbersforIndex(elemIndex, Sudoku);
            if (allowed.length < MINBRANCHUS || filledIndices.has(elemIndex)) {
                continue;
            }
            filledIndices.add(elemIndex);
            const arrIndex = getRandomIntBelow(allowed.length);
            const val = allowed[arrIndex];
            addInput(elemIndex, val);
            filled++;
        }
        // console.log("filled=",filled);
        [solution, solutionExistsBool] = solutionExists(Sudoku)
        solutionfound = solutionExistsBool
    }
    console.log("attempts to generate game:", attempts);
    solution.SudokuPrefill = solution.workElemArray.map(x=>getlog2for2Power(x));
    const createdSdk = removeElementsFromSolution(solution,numToFill);
    Sudoku = createdSdk;


    console.log("solution=",solution);
    drawGameSudoku(Sudoku);
    document.body.style.cursor = 'default';
    timeStart = new Date().getTime();
    startTimer(timeStart);
    intervalTimer = setInterval(function () {
        startTimer(timeStart);
    }, 1000);
}
function removeElementsFromSolution(workingSudoku,numToFill){
    let numElementsinSudoku = 81;
    const removedIndices = new Set();
    console.log("numToFill=",numToFill);
    while(numElementsinSudoku>numToFill){
        const elemIndex = getRandomIntBelow(80);
        if (removedIndices.has(elemIndex)) {
            continue;
        }
        removedIndices.add(elemIndex);
        workingSudoku = deleteInputSudoku(workingSudoku, elemIndex);
        numElementsinSudoku--;
    }
    return workingSudoku;
}
function solutionExists(inputSudoku) {

    let iteration = new Iteration(inputSudoku);
    const sudoFirstCopy = copySudokuHeap(inputSudoku, iteration);
    const sudokusHolder = [];
    sudokusHolder.push(sudoFirstCopy);

    // runDFSSudokuRecursive(sudokusHolder);
    iteration = runDFSSudokuIterativeHeap(sudokusHolder, iteration);
    return [iteration.solvedSudoku, iteration.solutionFound]
}

function startTimer(timeStart) {
    const dateNow = new Date()
    const timeNow = dateNow.getTime();
    const timeElapsedInSec = ((timeNow - timeStart) / 1000) | 0;
    let outtext = "Time Elapsed: "
    outtext += getTimeTextfromElapsedTime(timeElapsedInSec);
    document.getElementById("timer").innerHTML = outtext;
}

function getTimeTextfromElapsedTime(timeElapsedInSec) {
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
    outtext += ("0" + seconds).slice(-2);
    return outtext;
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

function checkGameOver() {
    console.log("Sudoku.numProcessed=", Sudoku.numProcessed);
    if (Sudoku.numProcessed >= 81) {
        console.log("Sudoku Done!");
        clearInterval(intervalTimer);
        setStorageTimes();
        displayStorageTimes();
        toggleDisplay("sudoku-box-holder");
        toggleDisplay("congratulations-box-holder");

    }
}

function displayStorageTimes() {

    const lastTime = localStorage.getItem("last-time-val");
    const bestEasy = localStorage.getItem("best-time-easy");
    const bestMedium = localStorage.getItem("best-time-medium");
    const bestHard = localStorage.getItem("best-time-hard");
    document.getElementById("today-time").innerHTML = getTimeTextfromElapsedTime(lastTime);
    if (bestEasy !== null) {
        document.getElementById("easy-best-time").innerHTML = getTimeTextfromElapsedTime(bestEasy);
    }
    if (bestMedium !== null) {
        document.getElementById("medium-best-time").innerHTML = getTimeTextfromElapsedTime(bestMedium);
    }
    if (bestHard !== null) {
        document.getElementById("hard-best-time").innerHTML = getTimeTextfromElapsedTime(bestHard);
    }

}

function setStorageTimes() {
    const dateNow = new Date()
    const timeNow = dateNow.getTime();
    const lastGameTimeSecs = ((timeNow - timeStart) / 1000) | 0;
    localStorage.setItem("last-time-val", lastGameTimeSecs);
    localStorage.setItem("last-level", gameLevel);


    if (gameLevel === 1) {
        const bestEasy = localStorage.getItem("best-time-easy");
        if (!bestEasy) {
            localStorage.setItem("best-time-easy", lastGameTimeSecs);
        } else {
            localStorage.setItem("best-time-easy", Math.min(lastGameTimeSecs, bestEasy));
        }
    } else if (gameLevel === 2) {
        const bestMedium = localStorage.getItem("best-time-medium");
        if (!bestMedium) {
            localStorage.setItem("best-time-medium", lastGameTimeSecs);
        } else {
            localStorage.setItem("best-time-medium", Math.min(lastGameTimeSecs, bestMedium));
        }
    } else if (gameLevel === 3) {
        const bestHard = localStorage.getItem("best-time-hard");
        if (!bestHard) {
            localStorage.setItem("best-time-hard", lastGameTimeSecs);
        } else {
            localStorage.setItem("best-time-hard", Math.min(lastGameTimeSecs, bestHard));
        }
    }

}