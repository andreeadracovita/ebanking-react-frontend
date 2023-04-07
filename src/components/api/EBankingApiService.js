import { apiClient } from "./ApiClient";

export const retrieveCustomerNameForUsernameApi
    = (username) => apiClient.get(`/${username}/customername`)

export const retrieveCheckingAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/checking`)

export const retrieveCreditAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/credit`)

export const retrieveSavingsAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/savings`)

export const retrieveAllLocalBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/local`)

export const retrieveAllForeignBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/foreign`)

export const retrieveAllBankAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts`)

export const retrieveAllCardsForUsernameApi
    = (username) => apiClient.get(`/${username}/cards`)

export const retrieveAllTransactionsForBankAccountNumberApi
    = (username, accountNumber) => apiClient.get(`/${username}/${accountNumber}/transactions`)

export const createTransactionApi
    = (username, transaction) => apiClient.post(`/${username}/transactions`, transaction)