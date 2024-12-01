import React from 'react';
import { Box,Select,MenuItem,useTheme} from "@mui/material";
import Header from 'components/Header';
import { useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import Test from 'components/ProfitDetails';



const MyComponent = () => {
    
    const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };
    
    const theme = useTheme();
    
    return (
      <Box
        sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.background.alt,
        }}
        className="h-full w-full"
      >
        <FlexBetween>
          <Header title="Transections History Test" subtitle="" />
          <Box>
            <Select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              sx={{ marginRight: '20px' }} // Optional styling
            >
              <MenuItem value="Omani">All Oman to TZS</MenuItem>
              <MenuItem value="TZS">All TZS to Oman</MenuItem>
            </Select>
          </Box>
        </FlexBetween>
        <Test CheckINCurrancy={selectedCurrency} />
      </Box>
    );
  };
  
export default MyComponent;