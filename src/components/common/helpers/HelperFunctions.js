export function hideCardCharacters(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(12);
}

export function checkPasscodeInput(event) {
    var key = event.keyCode;

    // Allow input if arrows, delete, backspace, digits and point keys were pressed 
    if(key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46 ||
        /[0-9]/.test(event.key)) {
        return;
    }
    event.preventDefault();
}

export function checkAmountInput(event) {
    var key = event.keyCode;

    // Allow input if arrows, delete, backspace, digits and point keys were pressed 
    if(key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46 ||
        /[0-9]|\./.test(event.key)) {
        return;
    }
    event.preventDefault();
}