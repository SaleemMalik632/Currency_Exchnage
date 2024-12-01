import React, { useEffect, useState, useMemo } from 'react';
import { useGetCanceledTransactionByCheckInCurrencyQuery, 
    useGetAllCanceledTransactionsQuery ,
    useDeleteTransactionMutation,
    useUpdateTransactionMutation,
 } from 'state/api';
import { Card, CardBody, Typography, CardHeader, Option, Select } from "@material-tailwind/react";
import { Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StatBox from './StatBox';
import { ShoppingCart, TrendingDown, AccountBalance, AttachMoney } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TABLE_HEAD = [
    "Invoice-NO", "Sender Number", "Receiver Number",
    "Amount", "Fee", "Total",
    "Rate", "Amount Check-out","Edit","Delete"
];

const COLUMN_KEYS = [
    "invoiceNumber", "senderPhoneNumber", "receiverPhoneNumber",
    "AmmountCheckin", "transactionFee", "TotalAfterFee",
    "exchangeRate", "AmmountCheckout"
];

const ViewAllTransections = ({ CheckINCurrancy }) => {
    const { data: completedTransactions, isLoading, refetch: refetchIN } = useGetCanceledTransactionByCheckInCurrencyQuery(CheckINCurrancy, { skip: !CheckINCurrancy });
    const { data: allCompletedTransactions, isLoading: loadingAll } = useGetAllCanceledTransactionsQuery();
    const theme = useTheme();
    const [searchColumn, setSearchColumn] = useState(COLUMN_KEYS[0]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        refetchIN();
    }, [CheckINCurrancy, refetchIN]);

    const completedTransactionsData = CheckINCurrancy === "All" ? allCompletedTransactions : completedTransactions;
    console.log('completedTransactionsData', completedTransactionsData);

    const filteredTransactions = useMemo(() => {
        if (!completedTransactionsData) return [];
        let transactions = completedTransactionsData.filter(transaction => {
            const searchMatch = searchValue
                ? transaction[searchColumn]?.toString().toLowerCase().includes(searchValue.toLowerCase())
                : true;
            return searchMatch;
        });
        return transactions.sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison !== 0) return dateComparison;
            const extractNumber = (invoice) => {
                const match = invoice.match(/-(\d+)$/);
                return match ? parseInt(match[1], 10) : 0;
            };
            const numA = extractNumber(a.invoiceNumber);
            const numB = extractNumber(b.invoiceNumber);
            return numB - numA;
        });
    }, [searchValue, searchColumn, completedTransactionsData]);

    const totalCheckIn = useMemo(() => {
        return completedTransactionsData?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0;
    }, [completedTransactionsData]);

    const totalCheckOut = useMemo(() => {
        return completedTransactionsData?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0;
    }, [completedTransactionsData]);

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

    // here i the edit and delete button is here
    const [DeleteTransaction] = useDeleteTransactionMutation();
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
                className="container mx-auto px-4 py-4 h-full w-full "
                sx={{
                    maxHeight: '190vh',
                    overflow: 'hidden',
                    marginBottom: '10rem',
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: "5px", // Adjusted border radius
                    boxShadow: theme.shadows[4],
                }}
            >
                <Card className="h-full w-full">
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


                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 m-2 mt-1 sm:absolute sm:top-5 sm:right-0">
                        <Select
                            label={<span className="font-bold">Search Column</span>}
                            value={searchColumn}
                            onChange={(value) => setSearchColumn(value)}
                            containerProps={{
                                className: "h-12 w-full sm:w-auto",
                            }}
                        >
                            {COLUMN_KEYS.map((key, index) => (
                                <Option key={key} value={key}>
                                    {TABLE_HEAD[index]}
                                </Option>
                            ))}
                        </Select>

                        <TextField
                            label={<span className="font-bold text-green-700">Search</span>}
                            variant="outlined"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '48px',
                                    padding: '10px', // Added padding for better spacing
                                    border: '1px solid',
                                    borderColor: 'grey.500',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    '&:hover': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: 'green',
                                    },
                                },
                                '& input': {
                                    height: 'auto',
                                    padding: '12px',
                                    color: 'black',
                                },
                            }}
                            className="w-full sm:w-2/3"
                        />
                    </div>

                    <CardBody className="px-4">
                        <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
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
                                    {isLoading ? (
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
                                                    <EditIcon  onClick  = {()=>handleEdit(transaction)} className="cursor-pointer text-blue-500" />
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <DeleteIcon onClick={()=>handleDelete(transaction._id)} className="cursor-pointer text-red-400" />
                                                </td> 

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={TABLE_HEAD.length} className="p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="opacity-70"
                                                >
                                                    No transactions found
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Edit Dialog  for edit the delete tranesctions*/}
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

export default ViewAllTransections;
