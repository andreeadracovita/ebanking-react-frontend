import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { hideCardCharacters } from './common/helpers/HelperFunctions';
import { useAuth } from './security/AuthContext';
import {
    retrieveAvailabilityDateForCardNumberApi,
    retrieveBankAccountForAccountNumberApi,
    updateCardActivateApi,
    updateCardDeactivateApi
} from './api/EBankingApiService';
import { Switch } from '@mui/material';

export default function CardDetailsComponent() {
    const [card, setCard] = useState();
    const [loadContent, setLoadContent] = useState();
    const [availabilityDate, setAvailabilityDate] = useState();
    const [attachedAccount, setAttachedAccount] = useState();
    const [blockSwitch, setBlockSwitch] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect (() => loadData(), []);
    useEffect (() => activateLoadContent(), [card, availabilityDate, attachedAccount]);

    const authContext = useAuth();
    const username = authContext.username;

    const switchStyle = {
        "& .MuiSwitch-switchBase": {
            color: "green"
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "red"
        }
    }

    function loadData() {
        if (location.state && location.state.card) {
            setCard(location.state.card);

            if (location.state.card.status === 'ACTIVE') {
                setBlockSwitch(false);
            } else {
                setBlockSwitch(true);
            }

            retrieveAvailabilityDateForCardNumberApi(username, location.state.card.cardNumber)
                .then(response => {
                    setAvailabilityDate(response.data);
                })
                .catch(error => console.log(error));

            retrieveBankAccountForAccountNumberApi(username, location.state.card.accountNumber)
                .then(response => {
                    setAttachedAccount(response.data);
                })
                .catch(error => console.log(error));
        }
    }

    function activateLoadContent() {
        if (card && availabilityDate && attachedAccount) {
            setLoadContent(true);
        }
    }

    function handleBlockSwitchChange() {
        if (blockSwitch === true) {
            updateCardActivateApi(username, card.cardNumber)
                .then(response => {
                    setCard(response.data);
                    setBlockSwitch(false);
                })
                .catch(error => console.log(error));
        } else {
            updateCardDeactivateApi(username, card.cardNumber)
                .then(response => {
                    setCard(response.data);
                    setBlockSwitch(true);
                })
                .catch(error => console.log(error));
        }
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            {
                loadContent &&
                <div>
                    { card.status === 'ACTIVE' && <p className="btn btn-success pe-none">Active</p> }
                    { card.status === 'INACTIVE' && <p className="btn btn-danger pe-none">Inactive</p> }

                    <p>Name on card</p>
                    <p className="ms-3 fw-bold">{card.nameOnCard}</p>
                    <br/>
                    <p>Card number</p>
                    <p className="ms-3 fw-bold">{hideCardCharacters(card.cardNumber)}</p>
                    <br/>
                    <p>Availability date</p>
                    <p className="ms-3 fw-bold">{availabilityDate}</p>
                    <br/>
                    <span>Block card</span>
                    <Switch 
                        checked={blockSwitch}
                        onChange={handleBlockSwitchChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={switchStyle}
                    />
                    <p className="mt-5">Attached account</p>
                    <p className="ms-3 fw-bold">{attachedAccount.accountName}</p>
                    <p className="ms-3 fw-bold">{attachedAccount.accountNumber}</p>
                    <p className="ms-3 fw-bold">{attachedAccount.balance.toLocaleString("de-CH")} {attachedAccount.currency}</p>
                    <br/>

                    <button className="btn btn-royal-blue btn-form mt-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}