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
import {  useAddDepositMutation, useGetAllAccountsQuery } from 'state/api';

const DespositAmmount = () => {
    const { data: accountsData, refetch: refetchAccounts } = useGetAllAccountsQuery();
    const theme = useTheme();
    const [labels] = useState({
        dateLabel: 'Date',
        depositAmountLabel: `Deposit Amount`,
        ALreadyBanks: `Select Bank`,
        TotalBalaceInSelectBank: `ALready Balance In Selected Bank`,
    });
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [DepositAmount, setDepositAmount] = useState(0);
    const [selectedBank, setSelectedBank] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [addDeposit] = useAddDepositMutation();
    useEffect(() => {
        if (accountsData) {
            setTotalAmount(accountsData.reduce((acc, bank) => acc + bank.TotalBalance, 0));
        }
    }, [accountsData]);
    useEffect(() => {
        if (selectedBank) {
            const selectedBankData = accountsData.find((bank) => bank.accountName === selectedBank);
            setTotalAmount(selectedBankData?.TotalBalance || 0);
        }
    }, [selectedBank, accountsData]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBank || !DepositAmount) {
            alert('Please fill in all required fields: Bank Name and  Deposit Amount');
            return;
        }
        try {
            await addDeposit({
                accountName: selectedBank,
                depositAmount: parseFloat(DepositAmount),
                currency: 'USD',
                Date: date,

            }).unwrap();
            alert(`Deposit of ${DepositAmount}  successful in ${selectedBank}`);
            setSelectedBank('');
            setDepositAmount(0);
            setDate(new Date().toISOString().split('T')[0]);
            refetchAccounts(); // Refetch to update the list of banks

        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Error submitting transaction', error);
        }
    };

    return (
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
                    Transaction Information
                </Typography>
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel id="bank-label">
                                {labels.ALreadyBanks}
                            </InputLabel>
                            <Select
                                labelId="bank-label"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                label={labels.ALreadyBanks}
                            >
                                {accountsData && accountsData.length > 0 ? (
                                    accountsData.map((bank) => (
                                        <MenuItem key={bank._id} value={bank.accountName}>
                                            {bank.accountName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No banks available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label={labels.TotalBalaceInSelectBank}
                            type="number"
                            value={totalAmount}
                            fullWidth
                            readOnly
                        />
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
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Deposit Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label={labels.depositAmountLabel}
                            type="number"
                            value={DepositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ ml: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    fontSize: '1rem', // Increase button text size
                                    padding: '12px 24px', // Increase button padding
                                }}
                            >
                                Deposit 
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default DespositAmmount;
