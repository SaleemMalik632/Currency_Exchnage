import React from 'react';
import FlexBetween from 'components/FlexBetween';
import AddAccountinfo from 'components/AccountInfo';
import Header from 'components/Header';

import {
    Box,
    useTheme,
    useMediaQuery,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import { useState } from 'react';
// import { useGetAccountinfoQuery } from 'state/api';

const Accountinfo = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="Account Details" subtitle="Add Accout Information  " />
                <Box>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        sx={{ marginRight: '10px' }} // Optional styling
                    >
                        <MenuItem value="Omani">Add Oman Bank Informations</MenuItem>
                        <MenuItem value="TZS">Add TZS Bank Informations</MenuItem>
                    </Select>
                </Box>
            </FlexBetween>
            <AddAccountinfo currency={selectedCurrency} sx={{}} /> 
        </Box>
    );
};

export default Accountinfo;
