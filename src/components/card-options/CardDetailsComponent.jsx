import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Switch } from '@mui/material';

import { CHFCurrency, formatCardNumber, hideCardCharacters } from '../common/helpers/HelperFunctions';
import { useAuth } from '../security/AuthContext';
import {
    retrieveAvailabilityDateForCardNumberApi,
    updateCardActivateApi,
    updateCardDeactivateApi
} from '../api/EBankingApiService';
import { ReactComponent as LockIcon } from '../../assets/lock.svg';
import { ReactComponent as EyeIcon } from '../../assets/eye.svg';

export default function CardDetailsComponent() {
    const [card, setCard] = useState();
    const [availabilityDate, setAvailabilityDate] = useState();
    const [blockSwitch, setBlockSwitch] = useState(false);
    const [showCardInfoSwitch, setShowCardInfoSwitch] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const authContext = useAuth();
    const username = authContext.username;

    useEffect (() => {
        if (!username) {
            return;
        }

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
                .catch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authContext]);

    const switchStyle = {
        "& .MuiSwitch-switchBase": {
            color: "grey"
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "blue"
        }
    }

    function handleBlockSwitchChange() {
        if (blockSwitch === true) {
            updateCardActivateApi(username, card.cardNumber)
                .then(response => {
                    setCard(response.data);
                    setBlockSwitch(false);
                })
                .catch();
        } else {
            updateCardDeactivateApi(username, card.cardNumber)
                .then(response => {
                    setCard(response.data);
                    setBlockSwitch(true);
                })
                .catch();
        }
    }

    function handleShowCardInfoSwitchChange() {
        setShowCardInfoSwitch(!showCardInfoSwitch);
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            <h1 className="main-content-title">Card details</h1>
        {
            card &&
            <span>
                { card.status === 'ACTIVE' && <p className="btn btn-success pe-none fontSizeGeneral">Active</p> }
                { card.status === 'INACTIVE' && <p className="btn btn-danger pe-none fontSizeGeneral">Inactive</p> }

                <p>Name on card</p>
                <p className="ms-3 mb-4 fw-bold">{card.nameOnCard}</p>

                {
                    showCardInfoSwitch &&
                    <div>
                        <p>Card number</p>
                        <p className="ms-3 mb-4 fw-bold">{formatCardNumber(card.cardNumber)}</p>
                        <p>CVV</p>
                        <p className="ms-3 mb-4 fw-bold">{card.cvv}</p>
                    </div>
                }
                {
                    !showCardInfoSwitch &&
                    <div>
                        <p>Card number</p>
                        <p className="ms-3 mb-4 fw-bold">{hideCardCharacters(card.cardNumber)}</p>
                    </div>
                }

                <p>Availability date</p>
                <p className="ms-3 mb-4 fw-bold">{availabilityDate}</p>

                <div className="mb-4">
                    <LockIcon className="me-2" width="24" height="24" />
                    <span>
                        Block card
                        <Switch 
                            checked={blockSwitch}
                            onChange={handleBlockSwitchChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={switchStyle}
                        />
                    </span>
                </div>

                <div className="mb-4">
                    <EyeIcon className="me-2" width="24" height="24" />
                    <span>
                        Show card info
                        <Switch 
                            checked={showCardInfoSwitch}
                            onChange={handleShowCardInfoSwitchChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={switchStyle}
                        />
                    </span>
                </div>

                <p>Attached account</p>
                <p className="ms-3 fw-bold">{card.bankAccount.accountName}</p>
                <p className="ms-3 fw-bold">{card.bankAccount.accountNumber}</p>
                <p className="ms-3 fw-bold">{CHFCurrency.format(card.bankAccount.balance)} {card.bankAccount.currency}</p>

                <button className="btn btn-royal-blue btn-form mt-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
            </span>
        }
        </div>
    );
}