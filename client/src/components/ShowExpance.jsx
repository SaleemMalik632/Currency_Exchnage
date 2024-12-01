import React, { useState, useMemo } from 'react';
import { Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardBody, Typography, Select, Option } from '@material-tailwind/react';
import StatBox from './StatBox';
import { ShoppingCart } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteExpanceMutation, useUpdateExpanceMutation } from 'state/api';

const TABLE_HEAD = [
    "Expense Date",
    "Account Name",
    "Expense Amount",
    "Expense Reason",
    "Remaining Balance",
    "Currency",
    "Edit",
    "Delete"
];

const COLUMN_KEYS = [
    "ExpanceDate",
    "BankName",
    "ExpanceAmount",
    "ExpanceReason",
    "RemainingBalance",
    "currency"
];

const ViewAllExpances = ({ expancesData }) => {
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const theme = useTheme();
    const [searchColumn, setSearchColumn] = useState(COLUMN_KEYS[0]);
    const [searchValue, setSearchValue] = useState("");
    const [deleteExpance] = useDeleteExpanceMutation();
    const [updateExpance] = useUpdateExpanceMutation();

    const filteredExpenses = useMemo(() => {
        if (!expancesData?.allExpancesData) return [];

        return expancesData.allExpancesData.filter(expense => {
            const value = expense[searchColumn]?.toString().toLowerCase();
            return searchValue ? value.includes(searchValue.toLowerCase()) : true;
        });
    }, [searchColumn, searchValue, expancesData?.allExpancesData]);

    if (expancesData?.message) {
        return <div>{expancesData.message}</div>;
    }

    if (!expancesData || !expancesData.allExpancesData) {
        return <div>No data available</div>;
    }

    const totalTZS = expancesData.allExpancesData.filter(expense => expense.currency === 'TZS').reduce((acc, expense) => acc + expense.ExpanceAmount, 0);

    const totalOmani = expancesData.allExpancesData.filter(expense => expense.currency === 'Omani').reduce((acc, expense) => acc + expense.ExpanceAmount, 0);

    // when the user press the delete button
    const handleDelete = async (id) => {
        try {
            await deleteExpance(id).unwrap();
            alert(`Transaction with ID ${id} deleted successfully.`);
        } catch (error) {
            alert("Failed to delete the transaction.");
        }
    };

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
            await updateExpance({ id: _id, updatedData });
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
            className="container mx-auto px-2  h-full w-full py-8"
            sx={{
                backgroundColor: theme.palette.background.alt,
                boxShadow: theme.shadows[4],
            }}
        >
            <Box
                className="container mx-auto px-4 py-10 h-full w-full"
                sx={{
                    maxHeight: '120vh',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                }}
            >
                <Card className="h-full w-full" sx={{ backgroundColor: theme.palette.background.alt }}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className='mt-16'>
                            <Typography variant="h5" color="blue-gray" className="font-bold text-center sm:text-left">
                                Transaction History
                            </Typography>
                            <div className="flex flex-row gap-4 items-center sm:items-start mt-2">
                                <StatBox title="Total Expances (OMR)" value={totalOmani} icon={<ShoppingCart sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                <StatBox title="Total Expances (TZS)" value={totalTZS} icon={<ShoppingCart sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                            </div>
                        </div>
                    </CardHeader>

                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 m-2 mt- sm:absolute sm:top-10 sm:right-0">
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

                    <CardBody className="px-4" sx={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '16px' }}>
                        <div style={{ overflowX: 'auto', maxHeight: '60vh' }} className="h-full w-full mt-5">
                            <table className="w-full table-auto text-left border-separate border-spacing-0 min-w-max">
                                <thead>
                                    <tr className="sticky top-0 z-10" style={{ backgroundColor: theme.palette.background.alt }}>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="p-4 border-b"
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
                                    {expancesData.isLoading ? (
                                        <tr>
                                            <td colSpan={TABLE_HEAD.length} className="p-4">
                                                <Typography variant="small" color="blue-gray" className="opacity-70">
                                                    Loading...
                                                </Typography>
                                            </td>
                                        </tr>
                                    ) : filteredExpenses.length ? (
                                        filteredExpenses.map((expense) => (
                                            <tr key={expense._id} className="hover:bg-blue-50">
                                                <td className="px-4 py-2 border-b">
                                                    {new Date(expense.ExpanceDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2 border-b">{expense.BankName || "N/A"}</td>
                                                <td className="px-4 py-2 border-b">
                                                    {expense.ExpanceAmount}{' '}
                                                    {expense.currency === 'Omani' ? ' (OMR)' : `(${expense.currency})`}
                                                </td>
                                                <td className="px-4 py-2 border-b">{expense.ExpanceReason}</td>
                                                <td className="px-4 py-2 border-b">{expense.RemainingBalance}</td>
                                                <td className="px-4 py-2 border-b">{expense.currency || "N/A"}</td>
                                                <td className="px-4 py-2 border-b">
                                                    <EditIcon
                                                        onClick={() => handleEdit(expense)}
                                                        className="cursor-pointer text-blue-400"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <DeleteIcon
                                                        onClick={() => handleDelete(expense._id)}
                                                        className="cursor-pointer text-red-400"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={TABLE_HEAD.length} className="p-4">
                                                <Typography variant="small" color="blue-gray" className="opacity-70">
                                                    No data available
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Edit Dialog for the expance show that show all the information in the dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>Edit Transaction</DialogTitle>
                    <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
                        <Grid container spacing={2} sx={{ mt: '5px' }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Transaction Date"
                                    fullWidth
                                    value={selectedRow?.ExpanceDate || ""}
                                    onChange={handleChange}
                                    name="ExpanceDate"
                                    InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Bank Name"
                                    fullWidth
                                    value={selectedRow?.BankName || ""}
                                    onChange={handleChange}
                                    name="BankName"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Transaction Amount"
                                    fullWidth
                                    value={selectedRow?.ExpanceAmount || ""}
                                    onChange={handleChange}
                                    name="ExpanceAmount"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Transaction Reason"
                                    fullWidth
                                    value={selectedRow?.ExpanceReason || ""}
                                    onChange={handleChange}
                                    name="ExpanceReason"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <TextField
                                    label="Remaining Balance"
                                    fullWidth
                                    value={selectedRow?.RemainingBalance || ""}
                                    onChange={handleChange}
                                    name="RemainingBalance"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* this is readonlu */}
                                <TextField
                                    label="Currency"
                                    fullWidth
                                    value={selectedRow?.currency || ""}
                                    onChange={handleChange}
                                    name="currency"
                                    disabled


                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
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

export default ViewAllExpances;