function logError(message){
    if(message==""){
        const errorsDiv = document.getElementById("output-errors");
        removeChildren(errorsDiv);
        return;
    }
    newError = document.createElement("div");
    newError.className = "output-error";
    newError.innerHTML = message;
    newErrorHeading = document.createElement("div");
    newErrorHeading.className = "output-heading";
    newErrorHeading.innerHTML = "Error Message";
    const errorsDiv = document.getElementById("output-errors");
    removeChildren(errorsDiv);
    errorsDiv.appendChild(newErrorHeading);
    errorsDiv.appendChild(newError);
    // alert(message);
}

function isPowerOf2(someNum) {
    return someNum && !(someNum & (someNum - 1));
}

function getlog2for2Power(someNum) {
    switch (someNum) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 3;
        case 8:
            return 4;
        case 16:
            return 5;
        case 32:
            return 6;
        case 64:
            return 7;
        case 128:
            return 8;
        case 256:
            return 9;
    }
}

function bitCount (n) {
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

function getAllowedNumbersforIndex(index,Sudoku){
    if(index<0) {
        return [];
    }
    let workingElem = Sudoku.workElemArray[index];
    outNumbers = [];
    for(let i=0;i<9;i++){
        if(workingElem&1==1){
            outNumbers.push(i+1);
        }
        workingElem = workingElem>>1;
    }
    return outNumbers;
}
function powerofTwo(power) {
    return 1 << power;
}


function isSudokuDone(sudokuInput) {
    if(solutionFound){
        return true;
    }
    let done = true;
    for (let i = 2; i <= 9 && done; i++) {
        if (sudokuInput.workElemIndicesByLength[i].size !== 0) {
            done = false;
        }
    }
    return done;
}
function isSudokuDoneHeap(sudokuInput,iteration) {
    if(iteration.solutionFound||sudokuInput.numProcessed>=81){
        return true;
    }

    return false;
}

function addToHeap(Arr,heapValue){
    Arr.push(heapValue);
    heapifyUP(Arr,Arr.length-1);
}
function heapifyUP(Arr,index){
    if(index<=1){
        return;
    }
    //integer division
    const parentIndex =  ~~(index/2);
    if(Arr[parentIndex]<=Arr[index]){
        return;
    }
    swap(Arr,parentIndex,index);
    heapifyUP(Arr,parentIndex);
}

function delMinHeap(heap){
    if(heap.length<=1){
        return -1;
    }
    const minval = heap[1];
    heap[1] = heap[heap.length-1];
    heap.pop();
    heapifyDown(heap,1);
    return minval;
}

function heapifyDown(Arr,index) {
    const leftChildIndex = index*2;
    const rightChildIndex = index*2+1;
    const arrLen = Arr.length;
    if(arrLen<leftChildIndex){
        return;
    }
    if(arrLen<rightChildIndex){
        if(Arr[leftChildIndex]<Arr[index]){
            swap(Arr,leftChildIndex,index);
        }
        return;
    }
    let leastChildIndex;
    if(Arr[leftChildIndex]<Arr[rightChildIndex]){
        leastChildIndex = leftChildIndex;
    } else {
        leastChildIndex = rightChildIndex;
    }
    if(Arr[leastChildIndex]<Arr[index]){
        swap(Arr,leastChildIndex,index);
        heapifyDown(Arr,leastChildIndex)
    }

}
function swap(inputArr,index1,index2){
    const temp = inputArr[index1];
    inputArr[index1] = inputArr[index2];
    inputArr[index2] = temp;
}
function dec2bin(dec){
    return (dec >>> 0).toString(2);
}