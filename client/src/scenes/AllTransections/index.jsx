import React, { useState } from 'react';
import { Box, Select, MenuItem } from "@mui/material";
import Header from 'components/Header';
import ViewAllTransections from 'components/AllTransecttions';
import FlexBetween from 'components/FlexBetween';

const VewALlTransections = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('All'); // Default to Omani

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    return (
        <Box className=" overflow-x-hidden hide-scrollbar h-screen">
            <FlexBetween>
                <Header title="Transaction History" subtitle="View All Transections" />
                <Box>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        sx={{ marginRight: '60px' }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Omani">OMR-to-TZS</MenuItem>
                        <MenuItem value="TZS">TZS-to-OMR</MenuItem>

                    </Select>
                </Box>
            </FlexBetween>

            <Box className="w-full overflow-x-hidden overflow-auto hide-scrollbar h-full">
                <ViewAllTransections CheckINCurrancy={selectedCurrency} />
            </Box>
        </Box>
    );
};

export default VewALlTransections;


