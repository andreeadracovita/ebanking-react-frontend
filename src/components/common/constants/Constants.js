export const OASI_LENGTH = 13;
export const PASSCODE_LENGTH = 5;
export const MAX_DESCRIPTION_LENGTH = 30;
export const MIN_DESCRIPTION_LENGTH = 3;
export const MAX_NAME_LENGTH = 30;
export const ACCOUNT_NUMBER_LENGTH = 21;

export const ErrorMessage = {
    authentication: 'Authentication failed. Please check your credentials',
    noAccountSelected: 'Select an account',
    amount: 'Amount must be completed and larger than 0',
    beneficiaryAccount: 'Beneficiary account must be completed',
    beneficiaryName: 'Beneficiary name must be completed'
};

export const ComponentState = {
    start: 'start',
    confirm: 'confirm',
    success: 'success',
    failure: 'failure',
    form: 'form'
};

export const Currency = {
    CHF: 0,
    EUR: 1,
    USD: 2
};