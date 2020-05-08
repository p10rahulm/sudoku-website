
function checkInput(id,value){
    console.log("id of div changed = ",id);
    console.log("value of div changed = ",value);
    const elemChanged =document.getElementById(id);
    const allowed = new Set(["1","2","3","4","5","6","7","8","9"]);
    if(!allowed.has(value)){

        alertText ="You have input value = '"+value+"'. Please add values between [1-9]";
        (elemChanged.value="").then(alert(alertText));

    }
    valNum = Number(value);

}