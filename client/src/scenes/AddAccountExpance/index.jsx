import React from 'react';
import FlexBetween from 'components/FlexBetween';
import AddAccountExpance from 'components/AddAccountExpance';
import Header from 'components/Header';
import Showexpance from 'components/ShowExpance';

import {
    Box,
    useTheme,
    useMediaQuery,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import { useState } from 'react';
// import { useGetAccountExpanceQuery } from 'state/api';

const AccountExpance = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="Expance Details" subtitle="Create and Add Account Information" />
            </FlexBetween>
            <AddAccountExpance currency={selectedCurrency} sx={{}} />
            {/* <Showexpance CheckINCurrancy={selectedCurrency} sx={{}} /> */}
        </Box>
    );
};

export default AccountExpance;
