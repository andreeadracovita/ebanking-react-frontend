import { apiClient } from './ApiClient';

export const Currency = {
    CHF: 0,
    EUR: 1,
    USD: 2
};

export const retrieveCustomerNameForIdApi
    = (username, id) => apiClient.get(`/${username}/customer/${id}`);

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

export const retrieveBankAccountForAccountNumberApi
    = (username, id) => apiClient.get(`/${username}/accounts/${id}`);

export const retrieveAllCardsForUsernameApi
    = (username) => apiClient.get(`/${username}/cards`);

export const retrieveAllTransactionsForBankAccountNumberApi
    = (username, accountNumber) => apiClient.get(`/${username}/${accountNumber}/transactions`);

export const retrieveAvailabilityDateForCardNumberApi
    = (username, id) => apiClient.get(`/${username}/cards/${id}/availabilityDate`);

export const createCheckingAccountApi
    = (username, currency) => apiClient.post(`/${username}/account/checking/${currency}`);

export const createSavingsAccountApi
    = (username) => apiClient.post(`/${username}/account/savings`);

export const createTransactionApi
    = (username, transaction) => apiClient.post(`/${username}/transaction`, transaction);

export const deleteBankAccountApi
    = (username, accountNumber) => apiClient.delete(`/${username}/accounts/${accountNumber}`);

export const updateBankAccountNameApi
    = (username, accountNumber, name) => apiClient.put(`/${username}/accounts/${accountNumber}`, name);

export const updateCardActivateApi
    = (username, cardNumber) => apiClient.put(`/${username}/cards/${cardNumber}/activate`);

export const updateCardDeactivateApi
    = (username, cardNumber) => apiClient.put(`/${username}/cards/${cardNumber}/deactivate`);
