/*
    * We will solve the sudoku using DFS guesses starting with the least index in workElemIndicesByLength
*/

function copySudoku(inputSudoku) {
    copyTotalTS = performance.now();
    copyinitTS = performance.now();
    const newSudoku = {};
    copyinitTT += performance.now() - copyinitTS;
    copyworkElemArrayTS = performance.now();
    newSudoku.workElemArray = inputSudoku.workElemArray.slice(0);
    copyworkElemArrayTT = copyworkElemArrayTT + (performance.now() - copyworkElemArrayTS);
    copyworkElemIndicesByLengthTS = performance.now()
    newSudoku.workElemIndicesByLength = {};
    for (let i = 1; i < 10; i++) {
        newSudoku.workElemIndicesByLength[i] = new Set(inputSudoku.workElemIndicesByLength[i]);
    }
    copyworkElemIndicesByLengthTT += performance.now() - copyworkElemIndicesByLengthTS;
    copyprocessedTS = performance.now()
    newSudoku.toProcess = inputSudoku.toProcess.slice(0);
    //no need for processed as of now
    // newSudoku.processed = new Set(inputSudoku.processed);
    // newSudoku.processed = inputSudoku.processed.slice(0);
    copyprocessedTT += performance.now() - copyprocessedTS;
    copycontradictionTS = performance.now();
    newSudoku.contradiction = inputSudoku.contradiction;
    copycontradictionTT += performance.now() - copycontradictionTS;
    copyTotalTT += performance.now() - copyTotalTS;
    return newSudoku;
}

let startTime, stackdepth;

function dfsCreatorSudoku() {
    startTime = performance.now();
    stackdepth = 0;
    globalDone = false;
    const sudoFirstCopy = copySudoku(Sudoku);
    let sudokusHolder = [];
    sudokusHolder.push(sudoFirstCopy);

    // runDFSSudokuRecursive(sudokusHolder);
    runDFSSudokuIterative(sudokusHolder);

}

function runDFSSudokuRecursive(sudokuHolder) {
    totalRunDFSTS = performance.now();
    nflTS = performance.now();
    poppingTS = performance.now();
    // stackdepth++;console.log("stackdepth = ",stackdepth);
    const runningSudoku = sudokuHolder.pop();
    poppingTT += performance.now() - poppingTS;
    // drawSudoku(runningSudoku,document.getElementById("output-boxes"),"div");
    // console.log("sudokuHolder popped current sudokuHolder = ", sudokuHolder);
    // console.log("sudoku popped  = ",runningSudoku);
    if (globalDone) {
        return;
    }
    if (isSudokuDone(runningSudoku)) {
        afterIsDoneTS = performance.now();
        globalDone = true;
        const timeTaken = performance.now() - startTime;
        // console.log("sudokuis done! sudokuInput=", runningSudoku)
        const holder = document.getElementById("output-boxes");
        removeChildren(holder);
        const solutionHeadingDiv = document.createElement("div");
        solutionHeadingDiv.innerHTML = "Solution: Done in ";
        solutionHeadingDiv.className = "output-heading";
        holder.appendChild(solutionHeadingDiv);


        const solutionTextDiv = document.createElement("div");

        const outText = "solved in " + timeTaken + "ms.<br>" +
            "totalRunDFSTT = " + totalRunDFSTT + "ms<br>" +
            "non-for loop time taken = " + nflTT + "ms<br>" +
            "for loop time taken = " + flTT + "ms<br><br><br>" +
            "Non-forloop<br>" +
            "least Index time taken = " + leastIndexIterationtimeTaken + "ms.<br>" +
            "afterIsDoneTT = " + afterIsDoneTT + "ms<br>" +

            "sudokuHolder popping time taken = " + poppingTT + "ms<br>" +
            "<br>Forloop<br>" +
            "copy time taken = " + copytimetaken + "ms.<br>" +
            "AddInputTT time taken = " + AddInputTT + "ms.<br>" +
            "sudokuHolder push time taken = " + skpushTT + "ms.<br>" +
            "<br>Other pages:Deepdive<br>" +

            "copy function: total time taken = " + copyTotalTT + "ms.<br>" +
            "copy function: initialize time taken = " + copyinitTT + "ms.<br>" +
            "copy function: workElemArray time taken = " + copyworkElemArrayTT + "ms.<br>" +
            "copy function: workElemIndicesByLength time taken = " + copyworkElemIndicesByLengthTT + "ms.<br>" +
            "copy function: processed time taken = " + copyprocessedTT + "ms.<br>" +
            "copy function: contradiction time taken = " + copycontradictionTT + "ms.<br>" +
            "updateWEIBL Function time taken = " + updateWEIBLTimeTaken + "ms.<br>" +
            "function updateAdditionForElems time taken = " + updateAdditionForElemsTimeTaken + "ms.<br>" +
            "function: addInputSudoku time taken = " + addinputSudokuTT + "ms.<br>";


        solutionTextDiv.innerHTML = outText;

        solutionTextDiv.className = "output-heading";
        holder.appendChild(solutionTextDiv);

        console.log("sudoku done. sudoku = ", runningSudoku);
        drawSudoku(runningSudoku, holder, "div");
        afterIsDoneTT += performance.now() - afterIsDoneTS;
        return runningSudoku;
    }
    leastIndexIterationTS = performance.now();
    const elemIndicesByLength = runningSudoku.workElemIndicesByLength;
    let leastIndex = 0;
    for (let i = 1; i <= 9 && !leastIndex; i++) {
        // console.log("runningSudoku.workElemIndicesByLength=",runningSudoku.workElemIndicesByLength);
        // console.log("runningSudoku.workElemIndicesByLength[i]=",runningSudoku.workElemIndicesByLength[i]);
        if (runningSudoku.workElemIndicesByLength[i].size !== 0) {
            leastIndex = i;
        }
    }

    // console.log("leastIndex = ",leastIndex);

    //get indices:

    const indexToIterate = runningSudoku.workElemIndicesByLength[leastIndex].values().next().value;
    const availableChoices = getAllowedNumbersforIndex(indexToIterate, runningSudoku);

    leastIndexIterationtimeTaken = leastIndexIterationtimeTaken + (performance.now() - leastIndexIterationTS);
    // console.log("indexToIterate=",indexToIterate);
    // console.log("availableChoices=",availableChoices);
    nflTT += performance.now() - nflTS;
    flTS = performance.now();
    for (let choiceIndex = 0; choiceIndex < availableChoices.length && !globalDone; choiceIndex++) {
        // console.log("choiceIndex=",choiceIndex);
        const choice = availableChoices[choiceIndex];
        // console.log("choice=",choice);
        copyTimeStart = performance.now();
        const runningSudokuCopy = copySudoku(runningSudoku);
        copytimetaken = copytimetaken + (performance.now() - copyTimeStart);
        AddInputTS = performance.now();
        addInputSudoku(runningSudokuCopy, indexToIterate, choice, 1);
        AddInputTT = AddInputTT + (performance.now() - AddInputTS);
        skpushTS = performance.now();
        if (!runningSudokuCopy.contradiction) {
            sudokuHolder.push(runningSudokuCopy);
        }
        skpushTT = skpushTT + (performance.now() - skpushTS);
        // console.log("sudokusHolder=",sudokusHolder)
    }
    flTT += performance.now() - flTS;
    totalRunDFSTT += performance.now() - totalRunDFSTS;
    runDFSSudokuRecursive(sudokuHolder);


}


function runDFSSudokuIterative(sudokuHolder) {
    totalRunDFSTS = performance.now();

    while (sudokuHolder.length != 0 && !globalDone) {
        nflTS = performance.now();
        poppingTS = performance.now();
        // stackdepth++;console.log("stackdepth = ",stackdepth);
        const runningSudoku = sudokuHolder.pop();
        poppingTT += performance.now() - poppingTS;
        if (isSudokuDone(runningSudoku)) {
            totalRunDFSTT = performance.now() - totalRunDFSTS
            globalDone = true;
            doFinishedProcessing(runningSudoku, 1, 0);
            continue;
        }
        leastIndexIterationTS = performance.now();
        const elemIndicesByLength = runningSudoku.workElemIndicesByLength;
        let leastIndex = 0;
        for (let i = 1; i <= 9 && !leastIndex; i++) {
            if (runningSudoku.workElemIndicesByLength[i].size !== 0) {
                leastIndex = i;
            }
        }
        const indexToIterate = runningSudoku.workElemIndicesByLength[leastIndex].values().next().value;
        const availableChoices = getAllowedNumbersforIndex(indexToIterate, runningSudoku);

        leastIndexIterationtimeTaken = leastIndexIterationtimeTaken + (performance.now() - leastIndexIterationTS);
        nflTT += performance.now() - nflTS;
        flTS = performance.now();
        for (let choiceIndex = 0; choiceIndex < availableChoices.length && !globalDone; choiceIndex++) {
            // console.log("choiceIndex=",choiceIndex);
            const choice = availableChoices[choiceIndex];
            // console.log("choice=",choice);
            copyTimeStart = performance.now();
            const runningSudokuCopy = copySudoku(runningSudoku);
            copytimetaken = copytimetaken + (performance.now() - copyTimeStart);
            AddInputTS = performance.now();
            addInputSudoku(runningSudokuCopy, indexToIterate, choice, 1);
            AddInputTT = AddInputTT + (performance.now() - AddInputTS);
            AddInputDirectLoopTS = performance.now();
            while (runningSudokuCopy.toProcess.length !== 0) {
                const elemIndextoUpdate = runningSudokuCopy.toProcess.pop();
                const elemVal = getlog2for2Power(runningSudokuCopy.workElemArray[elemIndextoUpdate]);
                addInputSudoku(runningSudokuCopy, elemIndextoUpdate, elemVal, 1);
            }
            AddInputDirectLoopTT = AddInputDirectLoopTT + (performance.now() - AddInputDirectLoopTS);
            skpushTS = performance.now();
            if (!runningSudokuCopy.contradiction) {
                sudokuHolder.push(runningSudokuCopy);
            }
            skpushTT = skpushTT + (performance.now() - skpushTS);
            // console.log("sudokusHolder=",sudokusHolder)
        }
        flTT += performance.now() - flTS;
    }
    if (!globalDone) {
        doFinishedProcessing(runningSudoku, 0, 0);
    }
}

function doFinishedProcessing(runningSudoku, solutionFound, errorlog = 0) {

    const holder = document.getElementById("output-boxes");
    if (!errorlog) {
        removeChildren(holder);
    }

    const solutionHeadingDiv = document.createElement("div");
    if (solutionFound) {
        solutionHeadingDiv.innerHTML = "Solution: Done in ";
    } else {
        solutionHeadingDiv.innerHTML = "Solution could not be found";
    }

    solutionHeadingDiv.className = "output-heading";
    holder.appendChild(solutionHeadingDiv);


    const solutionTextDiv = document.createElement("div");
    const timeTaken = performance.now() - startTime;
    let outText = "Total Time Taken: " + timeTaken + "ms.<br>";
    outText += "totalRunDFSTT = " + totalRunDFSTT + "ms<br>";
    outText += "non-for loop time taken = " + nflTT + "ms<br>";
    outText += "for loop time taken = " + flTT + "ms<br><br><br>";
    outText += "Non-forloop<br>";
    outText += "least Index time taken = " + leastIndexIterationtimeTaken + "ms.<br>";
    outText += "afterIsDoneTT = " + afterIsDoneTT + "ms<br>";

    outText += "sudokuHolder popping time taken = " + poppingTT + "ms<br>";
    outText += "<br>Forloop<br>";
    outText += "copy time taken = " + copytimetaken + "ms.<br>";
    outText += "AddInputTT time taken = " + AddInputTT + "ms.<br>";
    outText += "DirectProcessing time taken = " + AddInputDirectLoopTT + "ms.<br>";
    outText += "sudokuHolder push time taken = " + skpushTT + "ms.<br>";
    outText += "<br>Other pages:Deepdive<br>";

    outText += "copy function: total time taken = " + copyTotalTT + "ms.<br>";
    outText += "copy function: initialize time taken = " + copyinitTT + "ms.<br>";
    outText += "copy function: workElemArray time taken = " + copyworkElemArrayTT + "ms.<br>"
    outText += "copy function: workElemIndicesByLength time taken = " + copyworkElemIndicesByLengthTT + "ms.<br>"
    outText += "copy function: processed time taken = " + copyprocessedTT + "ms.<br>";
    outText += "copy function: contradiction time taken = " + copycontradictionTT + "ms.<br>";
    outText += "updateWEIBL Function time taken = " + updateWEIBLTimeTaken + "ms.<br>";
    outText += "function updateAdditionForElems time taken = " + updateAdditionForElemsTimeTaken + "ms.<br>";
    outText += "function: addInputSudoku time taken = " + addinputSudokuTT + "ms.<br>";
    outText += "Number of times delete was hit = " + hitsDelete + "\n";

    solutionTextDiv.innerHTML = outText;

    solutionTextDiv.className = "output-text";
    holder.appendChild(solutionTextDiv);

    console.log("Finished processing. Final sudoku = ", runningSudoku, "Total Time Taken: " + timeTaken + "ms.<br>");
    if (solutionFound) {
        drawSudoku(runningSudoku, holder, "div");
    }

}