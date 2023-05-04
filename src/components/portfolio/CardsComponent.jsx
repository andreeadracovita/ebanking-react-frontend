import { Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { useAuth } from '../security/AuthContext';
import { hideCardCharacters } from '../common/helpers/HelperFunctions';
import { retrieveAllCardsForUsernameApi, updateCardActivateApi, updateCardDeactivateApi } from '../api/EBankingApiService';
import { ReactComponent as CardIcon } from '../../assets/card.svg'; 
import { ReactComponent as DetailsIcon } from '../../assets/details.svg';
import { ReactComponent as LockIcon } from '../../assets/lock.svg';
import { ReactComponent as LockOpenIcon } from '../../assets/lock-open.svg';

export default function CardsComponent({ cards, setCards }) {
    const navigate = useNavigate();
    const authContext = useAuth();
    const username = authContext.username;

    function redirectCardDetails(card) {
        navigate('/card/details', { state: { card: card } });
    }

    function onBlockCardClicked(card) {
        updateCardDeactivateApi(username, card.cardNumber)
            .then(() => {
                retrieveAllCardsForUsernameApi(username)
                    .then(response => {
                        setCards(response.data);
                    })
                    .catch();
            })
            .catch();
    }

    function onUnblockCardClicked(card) {
        updateCardActivateApi(username, card.cardNumber)
            .then(() => {
                retrieveAllCardsForUsernameApi(username)
                    .then(response => {
                        setCards(response.data);
                    })
                    .catch();
            })
            .catch();
    }

    return (
        <span>
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                <span className="h4 text-royal-blue">
                    <CardIcon width="36px" height="36px" />
                    <span className="ms-3">Cards</span>
                </span>
                <button className="btn btn-royal-blue" onClick={() => {navigate('/cards/request-virtual')}}>+</button>
            </div>
            <Accordion className="mt-3">
            {
                cards.map(
                    card => (
                        <Accordion.Item key={card.cardNumber} eventKey={card.cardName}>
                        <Accordion.Header>
                            <div className="mt-3 me-2 w-100">
                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                    <span>{card.cardName}</span>
                                    <span className="account-balance">{card.status}</span>
                                </div>
                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                    <span className="account-number">{hideCardCharacters(card.cardNumber)}</span>
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-around">
                                <div className="text-center portfolio-accordion-button mx-0" onClick={() => redirectCardDetails(card)}>
                                    <DetailsIcon width="48" height="48" />
                                    <br/>
                                    <span>Details</span>
                                </div>
                                {
                                    card.status === 'ACTIVE' &&
                                    <div className="text-center portfolio-accordion-button mx-0" onClick={() => onBlockCardClicked(card)}>
                                        <LockIcon width="48" height="48" />
                                        <br/>
                                        <span>Block</span>
                                    </div>
                                }
                                {
                                    card.status === 'INACTIVE' &&
                                    <div className="text-center portfolio-accordion-button mx-0" onClick={() => onUnblockCardClicked(card)}>
                                        <LockOpenIcon width="48" height="48" />
                                        <br/>
                                        <span>Unblock</span>
                                    </div>
                                }
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    )
                )
            }
            </Accordion>
        </span>
    );
}