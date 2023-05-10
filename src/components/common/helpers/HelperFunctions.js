export function hideCardCharacters(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(12);
}

export function formatCardNumber(cardNumber) {
    return cardNumber.slice(0, 4) + ' ' +
        cardNumber.slice(4, 8) + ' ' +
        cardNumber.slice(8, 12) + ' ' +
        cardNumber.slice(12);
}

export function checkPasscodeInput(event) {
    var key = event.keyCode;

    // Allow input if arrows, delete, backspace, digits and point keys were pressed 
    if(key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46 ||
        /[0-9]/.test(event.key)) {
        return;
    }
    event.preventDefault();
}

export function checkAmountInput(event) {
    var key = event.keyCode;

    // Allow input if arrows, delete, backspace, digits and point keys were pressed 
    if(key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46 ||
        /[0-9]|\./.test(event.key)) {
        return;
    }
    event.preventDefault();
}

export function processSum(event, setAmount) {
    if (event.target.value === '') {
        setAmount(event.target.value);
        return;
    }

    if (!validSum(event.target.value)) {
        event.preventDefault();
        return;
    }

    setAmount(event.target.value);
}

function validSum(value) {
    if (!/^(0|([1-9][0-9]{0,6}))(\.(\d{1,2})?)?$/.test(value)) {
        return false;
    }
    return true;
}