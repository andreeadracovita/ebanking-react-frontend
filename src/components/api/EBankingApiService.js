import { apiClient } from "./ApiClient";

export const retrieveCustomerNameForUsernameApi
    = (username) => apiClient.get(`/${username}/customername`)

export const retrieveCheckingAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/checking`)

export const retrieveCreditAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/credit`)

export const retrieveSavingsAccountsForUsernameApi
    = (username) => apiClient.get(`/${username}/accounts/savings`)

export const retrieveAllCardsForUsernameApi
    = (username) => apiClient.get(`/${username}/cards`)