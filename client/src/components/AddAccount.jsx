import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme,
    Typography,
} from '@mui/material';
import { useGetAllAccountsQuery, useAddBankAccountMutation } from 'state/api';
import AccountDetails from 'components/AccountDetails';

const AddNewBankAccount  = () => {
    const theme = useTheme();
    const [labels] = useState({
        dateLabel: 'Date',
        CreateAccountName: 'Create Account Name',
        currencyLabel: 'Select Currency',
    });

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [newBankName, setNewBankName] = useState('');
    const [currency, setCurrency] = useState('TZS'); // Default currency
    const { data: accountsData, refetch: refetchAccounts } = useGetAllAccountsQuery();
    const [addBankAccount] = useAddBankAccountMutation();

    useEffect(() => {
        if (accountsData) {
            console.log('Fetched Accounts:', accountsData); // Debugging
        }
    }, [accountsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newBankName) {
            alert('Please fill in the Bank Name.');
            return;
        }
        try {
            await addBankAccount({
                accountName: newBankName,
                initialDeposit: 0, // Always zero as per requirement
                Date: date,
                currency: currency, // Selected currency
            }).unwrap();
            alert(`New Bank Added - ${newBankName}`);
            setNewBankName(''); // Clear the input
            setCurrency('TZS'); // Reset currency to default
            refetchAccounts(); // Refetch to update the list of banks

        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Error submitting transaction');
        }
    };

    return (
        <div>
            <Box
                sx={{
                    p: 4,
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: '5px',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Create Account Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label={labels.CreateAccountName}
                                value={newBankName}
                                onChange={(e) => setNewBankName(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="currency-label">{labels.currencyLabel}</InputLabel>
                                <Select
                                    labelId="currency-label"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    label={labels.currencyLabel}
                                >
                                    <MenuItem value="TZS">TZS</MenuItem>
                                    <MenuItem value="Omani">Omani Rial (OMR)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label={labels.dateLabel}
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} sx={{ mt: "10px" }}>
                            <Box>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Create Account
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <AccountDetails accountsData={accountsData} />
        </div>
    );
};

export default AddNewBankAccount; 
