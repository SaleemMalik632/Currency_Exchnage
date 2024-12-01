import React from 'react';
import { Box,Select,MenuItem,} from "@mui/material";
import Header from 'components/Header';
import { useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import AddAccountinfo from 'components/AccountDetails';


const Customers = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };
    return (
        <Box>
            <FlexBetween>
                <Header title="Account Details" subtitle="Add Accout Information  " />
                <Box>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        sx={{ marginRight: '20px' }} // Optional styling
                    >
                        <MenuItem value="Omani">All Account Omani</MenuItem>
                        <MenuItem value="TZS">All Account TZS</MenuItem>
                    </Select>
                </Box>
            </FlexBetween>
            <AddAccountinfo currency={selectedCurrency} />
        </Box>
        
    )
};


export default Customers