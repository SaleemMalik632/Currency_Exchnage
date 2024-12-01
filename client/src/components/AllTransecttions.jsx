import React, { useEffect, useState, useMemo } from 'react';
import { useGetDoneTransactionByCheckInCurrencyQuery, useGetAllCompletedTransactionsQuery, useDeleteTransactionMutation, useUpdateTransactionMutation } from 'state/api';
import { Card, CardBody, Typography, CardHeader, Select, Option } from "@material-tailwind/react";
import { Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StatBox from './StatBox';
import { ShoppingCart, TrendingDown, AccountBalance, AttachMoney } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const COLUMN_KEYS = ['invoiceNumber', 'senderPhoneNumber', 'receiverPhoneNumber', 'AmmountCheckin', 'transactionFee', 'TotalAfterFee', 'exchangeRate', 'AmmountCheckout'];
const TABLE_HEAD = ['Invoice #', 'Sender Phone', 'Receiver Phone', 'Amount', 'Fee', 'Total', 'Rate', 'Check-Out Amount', "Edit", "Delete"];

const ViewAllTransactions = ({ CheckINCurrancy, dashborad = false }) => {
    // Fetch all transactions and done transactions
    const { data: allCompletedTransactions, isLoading: loadingAll } = useGetAllCompletedTransactionsQuery();
    const { data: doneTransactions, isLoading: loadingDone, refetch: refetchIN } = useGetDoneTransactionByCheckInCurrencyQuery(CheckINCurrancy, { skip: !CheckINCurrancy });
    const [DeleteTransaction] = useDeleteTransactionMutation();

    const [searchColumn, setSearchColumn] = useState(COLUMN_KEYS[0]);
    const [searchValue, setSearchValue] = useState("");
    const theme = useTheme();

    useEffect(() => {
        if (CheckINCurrancy) {
            refetchIN();
        }
    }, [CheckINCurrancy, refetchIN]);

    // Determine which transactions to use
    const completedTransactions = CheckINCurrancy === "All" ? allCompletedTransactions : doneTransactions;

    const filteredTransactions = useMemo(() => {
        if (!completedTransactions) return [];
        let transactions = completedTransactions.filter(transaction => {
            const searchMatch = searchValue
                ? transaction[searchColumn]?.toString().toLowerCase().includes(searchValue.toLowerCase())
                : true; // Always true if no search value
            return searchMatch; // Return transactions that match the search condition
        });
        return transactions.sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date); // Sort by date descending
            if (dateComparison !== 0) return dateComparison; // If dates differ, sort by date first
            const extractNumber = (invoice) => {
                const match = invoice.match(/-(\d+)$/); // Extract number after the hyphen
                return match ? parseInt(match[1], 10) : 0; // Convert to number
            };
            const numA = extractNumber(a.invoiceNumber);
            const numB = extractNumber(b.invoiceNumber);
            return numB - numA;
        });
    }, [searchValue, searchColumn, completedTransactions,]);

    const totalCheckIn = useMemo(() => {
        return completedTransactions?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0;
    }, [completedTransactions]);

    const totalCheckOut = useMemo(() => {
        return completedTransactions?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0;
    }, [completedTransactions]);

    //  if the curry is All then 
    const totalCheckInOmani = useMemo(() => {
        const data = allCompletedTransactions?.filter(transaction => transaction.NameofCheckInCurrency === 'Omani');
        return data?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0;
    }, [allCompletedTransactions]);
    const totalCheckOutOmani = useMemo(() => {
        const data = allCompletedTransactions?.filter(transaction => transaction.NameofCheckOutCurrency === 'Omani');
        return data?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0;
    }, [allCompletedTransactions]);
    const totalCheckInTZS = useMemo(() => {
        const data = allCompletedTransactions?.filter(transaction => transaction.NameofCheckInCurrency === 'TZS');
        return data?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0;
    }
        , [allCompletedTransactions]);
    const totalCheckOutTZS = useMemo(() => {
        const data = allCompletedTransactions?.filter(transaction => transaction.NameofCheckOutCurrency === 'TZS');
        return data?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0;
    }, [allCompletedTransactions]);

    // when the user press the delete button
    const handleDelete = async (id) => {
        try {
            await DeleteTransaction(id).unwrap();
            alert(`Transaction with ID ${id} deleted successfully.`);
        } catch (error) {
            alert("Failed to delete the transaction.");
        }
    };

    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [updateTransaction] = useUpdateTransactionMutation();

    // function that will handle the edit button
    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const handleSave = async () => {
        try {
            const { _id, ...updatedData } = selectedRow;
            await updateTransaction({ id: _id, updatedData });
            alert('Transaction updated successfully');
            handleClose();
        } catch (error) {
            alert('Failed to update transaction:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedRow((prev) => ({ ...prev, [name]: value }));
    };



    return (
        <div

            className="container mx-auto px-2  h-full w-full "
            sx={{
                backgroundColor: theme.palette.background.alt,
                boxShadow: theme.shadows[4],
            }}

        >
            <Box
                className="container mx-auto px-4 py-4 h-full w-full"
                sx={{
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                }}
            >
                <Card className="h-full w-full  ">
                    <div className="mx-auto h-full w-full mt-10">
                        <CardHeader floated={false} shadow={false} className="rounded-none ">
                            <Typography variant="h5" color="blue-gray" className="font-bold text-center sm:text-left">
                                Transaction History
                            </Typography>
                            <div className="flex flex-col items-center sm:items-start mt-2">
                                {
                                    CheckINCurrancy === "All" ? (
                                        <>
                                            <div className='flex flex-col sm:flex-row gap-10 w-full justify-between'>
                                                <StatBox title="Total CheckIn (OMR)" value={totalCheckInOmani} icon={<ShoppingCart sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                                <StatBox title="Total CheckOut (OMR)" value={totalCheckOutOmani} icon={<TrendingDown sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                                <StatBox title="Total CheckIn (TZS)" value={totalCheckInTZS} icon={<AccountBalance sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                                <StatBox title="Total CheckOut (TZS)" value={totalCheckOutTZS} icon={<AttachMoney sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex flex-col sm:flex-row gap-10 w-full justify-between'>
                                                <StatBox title="Total Check-In" value={totalCheckIn} icon={<ShoppingCart sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                                <StatBox title="Total Check-Out" value={totalCheckOut} icon={<TrendingDown sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </CardHeader>
                    </div>


                    {/* Search Section */}
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 m-2  sm:absolute sm:top-5 sm:right-0">
                        <Select // Search Column
                            label={<span className="font-bold">Search Column</span>} // Bold label
                            value={searchColumn}
                            onChange={(value) => setSearchColumn(value)}
                            containerProps={{
                                className: "h-12 w-full sm:w-auto", // Set height for alignment and full width on mobile
                            }}
                        >
                            {COLUMN_KEYS.map((key, index) => (
                                <Option key={key} value={key}>
                                    {TABLE_HEAD[index]}
                                </Option>
                            ))}
                        </Select>

                        <TextField
                            label={<span className="font-bold text-green-700">Search</span>} // Bold label with green color
                            variant="outlined"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '48px', // Same height as the Select
                                    border: '1px solid', // Add border
                                    borderColor: 'grey.500', // Border color
                                    borderRadius: '4px', // Border radius
                                    backgroundColor: 'white', // Ensure background is white
                                    color: 'black', // Ensure text color is black
                                    '&:hover': {
                                        borderColor: 'black', // Darker border on hover
                                    },
                                    '&.Mui-focused': {
                                        borderColor: 'green', // Green border when focused
                                    },
                                },
                                '& input': {
                                    height: 'auto', // Auto height inside the input
                                    padding: '12px', // Consistent padding
                                    color: 'black', // Ensure input text is visible
                                },
                            }}
                            className="w-full sm:w-2/3" // Full width on mobile, 2/3 width on larger screens
                        />
                    </div>

                    <CardBody className="px-4">
                        <div className="overflow-auto" style={{ maxHeight: '50vh', marginTop: '15px' }}>
                            <table className="w-full table-auto text-left border-separate border-spacing-0 border-r-2">
                                <thead>
                                    <tr
                                        className="sticky top-0 z-10"
                                        style={{ backgroundColor: theme.palette.background.alt }}
                                    >
                                        {TABLE_HEAD.map((head, index) => (
                                            <th
                                                key={head}
                                                className={`p-4 border-b ${index === 0
                                                    ? "rounded-tl-lg"
                                                    : index === TABLE_HEAD.length - 1
                                                        ? "rounded-tr-lg"
                                                        : ""
                                                    }`}
                                                style={{ backgroundColor: theme.palette.background.alt }}
                                            >
                                                <Typography
                                                    variant="small"
                                                    className="font-bold"
                                                    style={{ color: theme.palette.text.secondary }}
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingAll || loadingDone ? (
                                        <tr>
                                            <td colSpan={TABLE_HEAD.length} className="p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="opacity-70"
                                                >
                                                    Loading...
                                                </Typography>
                                            </td>
                                        </tr>
                                    ) : filteredTransactions?.length ? (
                                        filteredTransactions.map((transaction) => (
                                            <tr key={transaction._id} className="hover:bg-blue-50">
                                                <td className="px-4 py-2 border-b">{transaction.invoiceNumber}</td>
                                                <td className="px-4 py-2 border-b">{transaction.senderPhoneNumber}</td>
                                                <td className="px-4 py-2 border-b">{transaction.receiverPhoneNumber}</td>
                                                <td className="px-4 py-2 border-b">
                                                    {transaction.AmmountCheckin}{' '}
                                                    {transaction.NameofCheckInCurrency === 'Omani' ? '(OMR)' : `(${transaction.NameofCheckInCurrency})`}
                                                </td>
                                                <td className="px-4 py-2 border-b">{transaction.transactionFee}</td>
                                                <td className="px-4 py-2 border-b">{transaction.TotalAfterFee}</td>
                                                <td className="px-4 py-2 border-b">{transaction.exchangeRate}</td>
                                                <td className="px-4 py-2 border-b">
                                                    {transaction.AmmountCheckout}{' '}
                                                    {transaction.NameofCheckOutCurrency === 'Omani' ? '(OMR)' : `(${transaction.NameofCheckOutCurrency})`}
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <EditIcon onClick={() => handleEdit(transaction)}   className="cursor-pointer text-blue-500"/>
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <DeleteIcon onClick={() => handleDelete(transaction._id)} className='cursor-pointer text-red-400' />
                                                </td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={TABLE_HEAD.length} className="p-4">
                                                <Typography variant="small" color="blue-gray" className="opacity-70">
                                                    No transactions found.
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogContent>
                        {selectedRow && (
                            <div>
                                <TextField
                                    margin="dense"
                                    label="Invoice Number"
                                    type="text"
                                    fullWidth
                                    name="invoiceNumber"
                                    value={selectedRow.invoiceNumber}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Sender Phone Number"
                                    type="text"
                                    fullWidth
                                    name="senderPhoneNumber"
                                    value={selectedRow.senderPhoneNumber}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Receiver Phone Number"
                                    type="text"
                                    fullWidth
                                    name="receiverPhoneNumber"
                                    value={selectedRow.receiverPhoneNumber}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Amount Checkin"
                                    type="text"
                                    fullWidth
                                    name="AmmountCheckin"
                                    value={selectedRow.AmmountCheckin}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Transaction Fee"
                                    type="text"
                                    fullWidth
                                    name="transactionFee"
                                    value={selectedRow.transactionFee}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Total After Fee"
                                    type="text"
                                    fullWidth
                                    name="TotalAfterFee"
                                    value={selectedRow.TotalAfterFee}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Exchange Rate"
                                    type="text"
                                    fullWidth
                                    name="exchangeRate"
                                    value={selectedRow.exchangeRate}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="Amount Checkout"
                                    type="text"
                                    fullWidth
                                    name="AmmountCheckout"
                                    value={selectedRow.AmmountCheckout}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>




            </Box>

        </div>

    );
};

export default ViewAllTransactions;
