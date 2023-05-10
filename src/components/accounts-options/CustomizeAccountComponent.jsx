import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { useAuth } from '../security/AuthContext';
import { ComponentState, MAX_DESCRIPTION_LENGTH } from '../common/constants/Constants';
import { updateBankAccountNameApi } from '../api/EBankingApiService';
import { CHFCurrency } from '../common/helpers/HelperFunctions';

export default function CustomizeAccountComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);
    const [account, setAccount] = useState();
    const [newName, setNewName] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => {
        if (location.state && location.state.account) {
            setAccount(location.state.account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleNewNameChange(event) {
        if (event.target.value.length < MAX_DESCRIPTION_LENGTH) {
            setNewName(event.target.value);
        }
    }

    function onSubmitForm() {
        const requestBody = {
            name: newName
        };
        updateBankAccountNameApi(username, account.accountNumber, requestBody)
            .then(() => {
                setComponentState(ComponentState.success);
            })
            .catch();
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Customize your account</h1>
            {
                componentState === ComponentState.start && account &&
                <div>
                    <div>
                        <p>{account.accountName}</p>
                        <p>{account.accountNumber}</p>
                        <p>{CHFCurrency.format(account.balance)} {account.currency}</p>
                    </div>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                <InputLabel htmlFor="outlined-adornment-account-name">New account name</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-account-name"
                                    type='text'
                                    value={newName}
                                    onChange={handleNewNameChange}
                                    label="New account name"
                                />
                            </FormControl>
                            <br/>
                            <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Save changes</button>
                            <br/>
                            <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </Box>
                </div>
            }
            {
                componentState === ComponentState.success &&
                <div>
                    <p className='mb-5'>Name successfully changed from <span className='fw-bold'>{account.accountName}</span> to <span className='fw-bold'>{newName}</span>.</p>
                    <button className="btn btn-royal-blue btn-form mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}