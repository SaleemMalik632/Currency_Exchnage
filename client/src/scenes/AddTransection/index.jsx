import React, { useEffect, useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import TransactionForm from 'components/TransactionForm';
import Header from 'components/Header';
import {
    Box,
    Select,
    MenuItem,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useGetDashboardQuery } from 'state/api';

const Dashboard = () => {
    // State for CheckIN and CheckOut banks
    const [selectedCurrency, setSelectedCurrency] = useState('Omani-to-TZS'); // Default to Omani to TZS

    const handleCurrencyChange = (event) => {
        const value = event.target.value;
        setSelectedCurrency(value);
        console.log('Selected Currency:', value); // Log selected currency
    };
    const [CheckINBankCurrency, CheckOutBankCurrency] = selectedCurrency.split("-to-");
    useEffect(() => {
        console.log('CheckINBankCurrency:', CheckINBankCurrency);
        console.log('CheckOutBankCurrency:', CheckOutBankCurrency);
    }
    , [selectedCurrency, CheckINBankCurrency, CheckOutBankCurrency]);

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
                <Box>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        sx={{ marginRight: '10px' }} // Optional styling
                    >
                        <MenuItem value="Omani-to-TZS">OMR to TZS</MenuItem>
                        <MenuItem value="TZS-to-Omani">TZS to OMR</MenuItem>
                    </Select>
                </Box>
            </FlexBetween>
            <TransactionForm 
                CheckINBankCurrency={CheckINBankCurrency} 
                CheckOutBankCurrency={CheckOutBankCurrency} 
            />
        </Box>
    );
};

export default Dashboard;
