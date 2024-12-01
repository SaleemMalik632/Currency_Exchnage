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
import { useAddExpanceMutation, useGetExpanceDataQuery, useGetAllAccountsQuery } from 'state/api';
import Showexpance from 'components/ShowExpance';

const AccountExpance = ({ currency }) => {
    const { data: accountsData, refetch: refetchAccounts } = useGetAllAccountsQuery();

    useEffect(() => {
        refetchAccounts();
    }, [accountsData, refetchAccounts, currency]);

    const theme = useTheme();
    const [labels] = useState({
        dateLabel: 'Date',
        AddExpanceAmountLabel: 'Add Expense Amount',
        AlreadyBanks: 'Selected Bank',
        ExpanceReasonLabel: 'Expense Details',
    });

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [addExpenseAmount, setAddExpenseAmount] = useState(0);
    const [selectedBank, setSelectedBank] = useState('');
    const [expenseReason, setExpenseReason] = useState('');
    const [addExpense] = useAddExpanceMutation();
    const { data: expensesData, refetch: refetchAllExpenses } = useGetExpanceDataQuery();
    console.log(expensesData);

    useEffect(() => {
        refetchAllExpenses();
    }, [expensesData, currency, refetchAllExpenses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBank || !addExpenseAmount) {
            alert('Please fill in all required fields: Bank Name and Expense Amount.');
            return;
        }
        try {
            await addExpense({
                accountName: selectedBank,
                AddExpanceData: parseFloat(addExpenseAmount),
                currency: currency,
                Date: date,
                Reason: expenseReason,
            }).unwrap();
            alert(`Expense of ${addExpenseAmount} successful in ${selectedBank}`);
            setAddExpenseAmount(0);
            setExpenseReason('');
            setDate(new Date().toISOString().split('T')[0]);
            setSelectedBank('');
            refetchAccounts();
            refetchAllExpenses();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Error submitting transaction');
        }
    };

    return (
        <div>
            <Box
                className="container mt-4 px-0 overflow-x-hidden h-full w-full"
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
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="bank-label">
                                    {labels.AlreadyBanks}
                                </InputLabel>
                                <Select
                                    labelId="bank-label"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    label={labels.AlreadyBanks}
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
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <TextField
                                label={labels.AddExpanceAmountLabel}
                                type="number"
                                value={addExpenseAmount}
                                onChange={(e) => setAddExpenseAmount(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
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
                        Expense Information
                    </Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                            <TextField
                                label={labels.ExpanceReasonLabel}
                                value={expenseReason}
                                onChange={(e) => setExpenseReason(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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
                                    Add Expense
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <div style={{ marginTop: '2.5rem' }}> {/* Adjust value as needed */}
                <Showexpance expancesData={expensesData} sx={{ mb: "5px" }} />
            </div>

        </div>
    );
};

export default AccountExpance;
