import { useEffect, useState } from "react"
import { useAuth } from "./security/AuthContext";
import {
    retrieveAllCardsForUsernameApi,
    retrieveCheckingAccountsForUsernameApi,
    retrieveCreditAccountsForUsernameApi,
    retrieveSavingsAccountsForUsernameApi
} from "./api/EBankingApiService"

export default function PortfolioComponent() {

    const [checkingAccounts, setCheckingAccounts] = useState([])

    const [savingsAccounts, setSavingsAccounts] = useState([])

    const [creditAccounts, setCreditAccounts] = useState([])

    const [cards, setCards] = useState([])

    useEffect (() => refreshContent())

    const authContext = useAuth()
    const username = authContext.username

    function refreshContent() {
        retrieveCheckingAccountsForUsernameApi(username)
            .then(response => {
                setCheckingAccounts(response.data)
            })
            .catch(error => console.log(error))
        
        retrieveSavingsAccountsForUsernameApi(username)
            .then(response => {
                setSavingsAccounts(response.data)
            })
            .catch(error => console.log(error))

        retrieveCreditAccountsForUsernameApi(username)
            .then(response => {
                setCreditAccounts(response.data)
            })
            .catch(error => console.log(error))
        
        retrieveAllCardsForUsernameApi(username)
            .then(response => {
                setCards(response.data)
            })
            .catch(error => console.log(error))
    }

    function hideCardCharacters(cardNumber) {
        return '**** **** **** ' + cardNumber.slice(12);
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Portfolio</h1>
            
            <div className="row pb-2 mb-3">
                <div className="col bg-light me-5 pt-2 pb-2">
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                        <span className="h4 text-royal-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.216 0c3.381 0 6.208 1.188 6.208 3.093v14.435c0 1.559-1.876 2.63-4.429 2.975v.57a.83.83 0 01-.063.32C15.494 23.014 12.872 24 9.788 24s-5.706-.988-6.144-2.606a.83.83 0 01-.057-.216l-.007-.105v-8.827l.006-.153c.12-1.475 1.967-2.494 4.421-2.824V3.093l.007-.153C8.16 1.125 10.925 0 14.216 0zM9.788 19.495c-1.76 0-3.37-.322-4.509-.9l.001 2.32.006.052c.126.579 2.05 1.353 4.502 1.353s4.376-.774 4.501-1.353l.007-.06v-1.09a.85.85 0 01-.001-.13l.001-1.091c-1.139.577-2.748.899-4.508.899zm6.208-4.377v3.684c1.644-.266 2.728-.864 2.728-1.274v-2.986c-.732.282-1.666.472-2.728.576zm-1.7-.678c-1.139.577-2.748.898-4.508.898-1.76 0-3.37-.321-4.509-.898l.001 1.97.006.051c.126.58 2.05 1.353 4.502 1.353s4.376-.774 4.501-1.353l.007-.059zm-4.508-3.606c-2.537 0-4.508.828-4.508 1.412v-.006.015c.019.563 1.854 1.349 4.256 1.4l.252.003c2.537 0 4.508-.828 4.508-1.412s-1.971-1.412-4.508-1.412zm4.979-.645l-.207.006c.894.52 1.436 1.217 1.436 2.05l-.001-.005.002 1.186c.804-.091 1.51-.243 2.04-.436.256-.093.457-.191.59-.282l.072-.054c.015-.011.022-.016.025-.012v-3.34c-1.018.515-2.412.826-3.957.887zm3.957-4.903c-1.139.577-2.748.9-4.508.9-1.76 0-3.37-.323-4.51-.9l.002 1.821c0 .555 1.831 1.36 4.261 1.41a.859.859 0 01.247.042.842.842 0 01.245-.041c2.43-.05 4.263-.856 4.263-1.41zM14.216 1.68c-2.537 0-4.508.829-4.508 1.413 0 .583 1.97 1.412 4.508 1.412 2.537 0 4.508-.829 4.508-1.412 0-.584-1.971-1.413-4.508-1.413z" fillRule="nonzero" fill="currentColor"></path>
                            </svg>
                            <span className="ms-3">Accounts</span>
                        </span>
                        <button className="btn btn-royal-blue" onClick={() => {}}>+</button>
                    </div>
                    {
                        checkingAccounts.map(
                            account => (
                                <div className="mt-3" key={account.accountNumber}>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{account.accountName}</span>
                                        <span className="account-balance">{account.balance.toLocaleString("de-DE")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number">{account.accountNumber}</span>
                                        <span>{account.currency}</span>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="col bg-light pt-2 pb-2">
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                        <span className="h4 text-royal-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.996 1.199l.116.051 3.878 2.067.441-.263a.85.85 0 01.717-.074l.115.05 5.092 2.673a.851.851 0 01.336 1.19l3.743 1.995a.85.85 0 01.14 1.407l-.098.07-7.957 4.837a.85.85 0 01-.752.065l-.103-.048-3.26-1.813v1.506l3.654 2.033 7.535-4.581a.85.85 0 01.977 1.386l-.094.067-7.957 4.838a.85.85 0 01-.752.065l-.103-.049-3.259-1.813v1.581l3.653 2.033 7.535-4.58a.85.85 0 01.977 1.385l-.094.067-7.957 4.838a.85.85 0 01-.752.065l-.103-.049-4.522-2.516a.847.847 0 01-.287-.26l-5.057-2.677a.85.85 0 01-.195-.142L.587 14.37a.85.85 0 01.722-1.535l.104.05 2.933 1.63v-1.582l-3.759-2.09a.85.85 0 01.722-1.535l.104.05 2.933 1.629V9.479L.587 7.389a.85.85 0 01-.124-1.401l.098-.069 7.712-4.647a.85.85 0 01.723-.073zm4.898 3.558L6.045 9.46v6.021l3.659 1.937v-5.426a.845.845 0 01.034-.269l.005-.015a.665.665 0 01.035-.095c.004-.007.008-.013.01-.02a.426.426 0 01.023-.045l.025-.04a.85.85 0 01.014-.022l-.04.062a.854.854 0 01.194-.234l-.083.08a.843.843 0 01.07-.07l.013-.01.007-.008a.845.845 0 01.06-.045l.018-.011 7.195-4.714-3.39-1.779zm4.26 3.242L12.196 11.9l2.861 1.592 6.261-3.806-3.164-1.687zM8.737 2.977l-6.041 3.64L5.18 7.998l6.108-3.661-2.551-1.36z" fillRule="nonzero" fill="currentColor"></path>
                            </svg>
                            <span className="ms-3">Credits</span>
                        </span>
                        <button className="btn btn-royal-blue" onClick={() => {}}>+</button>
                    </div>
                    {
                        creditAccounts.map(
                            credit => (
                                <div className="mt-3" key={credit.accountNumber}>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{credit.accountName}</span>
                                        <span className="account-balance">{credit.balance.toLocaleString("de-DE")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number">{credit.accountNumber}</span>
                                        <span>{credit.currency}</span>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className="row pb-2 mb-3">
                <div className="col bg-light me-5 pt-2 pb-2">
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                        <span className="h4 text-royal-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.172 6.255l.107.007 5.326.651a.845.845 0 01-.1 1.683L9.4 8.589 5.56 8.12l.745 1.662a.841.841 0 01-.032.751l-.062.096-.16.208-.271.344-.152.187c-.45.548-.933 1.096-1.434 1.61-.153.157-.306.31-.458.456-.6.575-1.198.947-1.762 1.154l-.226.074.304 2.602.062.018c.637.194 1.427.527 2.296 1.044l.264.16c.516.323 1.164.82 1.923 1.458a59.853 59.853 0 011.61 1.414l.74.684.287.27h.297l.741-1.262a6.035 6.035 0 01-1.096-.502.842.842 0 01-.29-1.158.85.85 0 011.163-.29c1.66.993 5.405 1.166 7.377-.001a.85.85 0 011.162.294c.24.401.107.92-.296 1.157a6.17 6.17 0 01-.875.425l1.087 1.337h.493l.213-.286.106-.147c.431-.605.863-1.284 1.266-2.021.71-1.302 1.25-2.637 1.551-3.961.695-3.06-.8-5.387-4.075-7.223a.842.842 0 01-.323-1.15.85.85 0 011.154-.321c3.862 2.164 5.784 5.16 4.897 9.066-.338 1.49-.935 2.966-1.715 4.396-.437.8-.904 1.535-1.373 2.191l-.227.313c-.177.238-.318.416-.414.53a.849.849 0 01-.543.295l-.106.007H18.1a.85.85 0 01-.585-.233l-.074-.08-1.588-1.955a.84.84 0 01-.154-.29 11.925 11.925 0 01-3.742.019.688.688 0 01-.036.11l-.052.103-1.12 1.908a.848.848 0 01-.62.41l-.112.008H8.895a.85.85 0 01-.59-.238l-.701-.662a62.5 62.5 0 00-1.622-1.46l-.478-.407-.452-.373a13.93 13.93 0 00-1.28-.945 9.606 9.606 0 00-1.915-.93 5.289 5.289 0 00-.726-.21.846.846 0 01-.674-.625l-.02-.108L0 14.302l.002-.21c.012-.088.033-.19.076-.308.122-.334.325-.603.738-.67l.13-.014c.41-.022.963-.26 1.613-.883.138-.133.278-.272.418-.416.464-.476.917-.99 1.338-1.503l.235-.29-1.148-2.565a.845.845 0 01.77-1.188zM6.85 12a.85.85 0 110 1.7.85.85 0 010-1.7zm10.942-1.713c.427.19.619.69.428 1.115a.849.849 0 01-1.12.427c-1.56-.695-3.223-.695-4.774-.271a6.824 6.824 0 00-.64.206l-.147.06a.849.849 0 01-1.125-.414.843.843 0 01.416-1.12c.212-.096.57-.23 1.048-.36 1.897-.519 3.945-.519 5.914.357zM14.268 0a4.203 4.203 0 014.212 4.195 4.203 4.203 0 01-4.212 4.195 4.203 4.203 0 01-4.211-4.195A4.203 4.203 0 0114.268 0zm0 1.688a2.512 2.512 0 00-2.516 2.507 2.512 2.512 0 002.516 2.507 2.511 2.511 0 002.517-2.507 2.511 2.511 0 00-2.517-2.507z" fillRule="nonzero" fill="currentColor"></path>
                            </svg>
                            <span className="ms-3">Savings</span>
                        </span>
                        <button className="btn btn-royal-blue" onClick={() => {}}>+</button>
                    </div>
                    {
                        savingsAccounts.map(
                            saving => (
                                <div className="mt-3" key={saving.accountNumber}>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{saving.accountName}</span>
                                        <span className="account-balance">{saving.balance.toLocaleString("de-DE")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number">{saving.accountNumber}</span>
                                        <span>{saving.currency}</span>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="col bg-light pt-2 pb-2">
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                        <span className="h4 text-royal-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.15,3.05 C23.0888841,3.05 23.85,3.81111593 23.85,4.75 L23.85,4.75 L23.85,18.05 C23.85,18.9888841 23.0888841,19.75 22.15,19.75 L22.15,19.75 L1.85,19.75 C0.911115925,19.75 0.15,18.9888841 0.15,18.05 L0.15,18.05 L0.15,4.75 C0.15,3.81111593 0.911115925,3.05 1.85,3.05 L1.85,3.05 Z M22.15,10.744 L1.85,10.744 L1.85,18.05 L22.15,18.05 L22.15,10.744 Z M22.15,4.75 L1.85,4.75 L1.85,7.344 L22.15,7.344 L22.15,4.75 Z" fillRule="nonzero" fill="currentColor"></path>
                            </svg>
                            <span className="ms-3">Cards</span>
                        </span>
                        <button className="btn btn-royal-blue" onClick={() => {}}>+</button>
                    </div>
                    {
                        cards.map(
                            card => (
                                <div className="mt-3" key={card.cardNumber}>
                                    <span>{card.cardName}</span>
                                    <br/>
                                    <span className="account-number">{hideCardCharacters(card.cardNumber)}</span>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}