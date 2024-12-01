import React from 'react';
import { Box,Select,MenuItem,} from "@mui/material";
import Header from 'components/Header';
import { useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import ViewCancelTransections from 'components/AllCancelTransections';



const VewCancelTransections = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('All'); // Default to Omani
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };
    return (
        <Box>
            <FlexBetween>
                <Header title="Cancel Transections" subtitle="View All Transections" /> 
                <Box sx={{marginRight:'60px'}}>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                    > 
                         <MenuItem value="All"  >Cancel All</MenuItem>
                        <MenuItem value="Omani">OMR-To-TZS</MenuItem>  
                        <MenuItem value="TZS">TZS-To-OMR</MenuItem>
                    </Select>
                </Box>
            </FlexBetween>
            <ViewCancelTransections CheckINCurrancy={selectedCurrency} />
        </Box> 
        
    )
};


export default VewCancelTransections