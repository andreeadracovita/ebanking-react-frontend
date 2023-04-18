export function hideCardCharacters(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(12);
}