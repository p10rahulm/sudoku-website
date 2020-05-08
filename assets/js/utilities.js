function logError(message){
    newError = document.createElement("div");
    newError.className = "output-error";
    newError.innerHTML = message;
    const errorsDiv = document.getElementById("output-errors");
    removeChildren(errorsDiv);
    errorsDiv.appendChild(newError);
    // alert(message);
}

function removeChildren(someDiv){
    while (someDiv.hasChildNodes()) {
        someDiv.removeChild(someDiv.firstChild);
    }
}

function bitCount (n) {
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

