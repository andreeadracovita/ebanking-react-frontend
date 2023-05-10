import { apiClient } from './ApiClient';

// Create
export const createUserAccountApi
    = (payload) => apiClient.post('/users/create', payload);

export const createCheckingAccountApi
    = (username, currency) => apiClient.post(`/${username}/account/checking/${currency}`);

export const createSavingsAccountApi
    = (username) => apiClient.post(`/${username}/account/savings`);

export const createCreditAccountApi
    = (username) => apiClient.post(`/${username}/account/credit`);

export const createVirtualCardForBankAccountApi
    = (username, accountNumber) => apiClient.post(`/${username}/card/${accountNumber}`);

export const createTransactionApi
    = (username, source, transaction) => apiClient.post(`/${username}/transaction/${source}`, transaction);

// Read
export const checkValidUsernameApi
    = (payload) => apiClient.post('/users/username', payload);

export const retrieveCustomerNameForCustomerIdApi
    = (username, id) => apiClient.get(`/${username}/customername/${id}`);

export const retrieveCustomerNameForUsernameApi
    = (username) => apiClient.get(`/${username}/customername`);

export const retrieveCheckingAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/checking`);

export const retrieveCreditAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/credit`);

export const retrieveSavingsAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/savings`);

export const retrieveAllLocalBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/local`);

export const retrieveAllLocalCheckingBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/checking/local`);

export const retrieveAllForeignBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/foreign`);

export const retrieveAllBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts`);

export const retrievePayingBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/paying`);

export const retrieveAllCardsForUsernameApi
    = (username) => apiClient.get(`/${username}/cards`);

export const retrieveAllTransactionsForBankAccountNumberApi
    = (username, accountNumber) => apiClient.get(`/${username}/${accountNumber}/transactions`);

export const retrieveAvailabilityDateForCardNumberApi
    = (username, id) => apiClient.get(`/${username}/cards/${id}/availabilityDate`);

// Update
export const updateBankAccountNameApi
    = (username, accountNumber, payload) => apiClient.put(`/${username}/accounts/${accountNumber}`, payload);

export const updateCardActivateApi
    = (username, cardNumber) => apiClient.put(`/${username}/cards/${cardNumber}/activate`);

export const updateCardDeactivateApi
    = (username, cardNumber) => apiClient.put(`/${username}/cards/${cardNumber}/deactivate`);

export const updateUserPasscodeApi
    = (username, payload) => apiClient.put(`/${username}/passcode`, payload);

// Delete
export const deleteBankAccountApi
    = (username, accountNumber) => apiClient.delete(`/${username}/accounts/${accountNumber}`);