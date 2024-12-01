import React, { useState } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, Grid, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardBody } from '@material-tailwind/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEditAccountMutation, useDeleteAccountMutation } from 'state/api';
import StatBox from './StatBox';
import MoneyIcon from '@mui/icons-material/Money';

const TABLE_HEAD = [
    "Bank Name", "Total Balance", "Currency", "Created At", "Updated At", "Edit", "Delete"
];

const Accounts = ({ accountsData }) => {
    const theme = useTheme();
    const [editAccount] = useEditAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const handleUpdate = async () => {
        const { _id: id, currency, ...updatedData } = selectedRow;
        try {
            await editAccount({ id, updatedData }).unwrap();
            alert(`Account with ID ${id} updated successfully.`);
            handleClose();
        } catch (error) {
            alert("Failed to update the account.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAccount(id).unwrap();
            alert(`Account with ID ${id} deleted successfully.`);
        } catch (error) {
            alert("Failed to delete the account.");
        }
    };

    const handleInputChange = (field, value) => {
        if (field === "currency") return;
        setSelectedRow((prev) => ({ ...prev, [field]: value }));
    };

    if (!accountsData || accountsData.length === 0) {
        return <div>No accounts available</div>;
    }

    // Calculate total balances
    const totalOmani = accountsData
        .filter(account => account.currency === 'Omani')
        .reduce((acc, account) => acc + account.TotalBalance, 0);

    const totalTZS = accountsData
        .filter(account => account.currency === 'TZS')
        .reduce((acc, account) => acc + account.TotalBalance, 0);

    return (
        <div className='container mx-auto py-4 h-full w-full'>
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
                <Card className="h-full w-full" sx={{ backgroundColor: theme.palette.background.alt }}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <Typography variant="h2" color="blue-gray" className="font-bold text-center sm:text-left">
                            Accounts Details
                        </Typography>
                        <div className="flex flex-col sm:flex-row w-full gap-5 items-center sm:items-start">
                            <StatBox
                                title={<span className="font-bold">Total Amount In (OMR)</span>} // Make the title bold
                                value={totalOmani}
                                icon={<MoneyIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} // Use MoneyIcon icon
                                className="w-full sm:w-1/2"
                            />
                            <StatBox
                                title={<span className="font-bold">Total Amount In (TZS)</span>} // Make the title bold
                                value={totalTZS}
                                icon={<MoneyIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} // Use AttachMoneyMoneyIcon icon
                                className="w-full sm:w-1/2"
                            />
                        </div>
                    </CardHeader>
                    <CardBody className="px-4" sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div style={{ overflowX: 'auto' }} className='h-full w-full'>
                            <table className="w-full table-auto text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="sticky top-0 z-10" style={{ backgroundColor: theme.palette.background.alt }}>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="p-4 border-b" style={{ backgroundColor: theme.palette.background.alt }}>
                                                <Typography variant="small" className="font-bold" style={{ color: theme.palette.text.secondary }}>
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountsData.map((row) => (
                                        <tr key={row._id}>
                                            <td className="px-4 py-2 border-b">{row.accountName}</td>
                                            <td className="px-4 py-2 border-b">
                                                {row.TotalBalance}{' '}
                                                {row.currency === 'Omani' ? ' (OMR)' : `(${row.currency})`}
                                            </td>
                                            <td className="px-4 py-2 border-b">{row.currency}</td>
                                            <td className="px-4 py-2 border-b">{new Date(row.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border-b">{new Date(row.updatedAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border-b">
                                                <EditIcon onClick={() => handleEdit(row)} className='cursor-pointer text-blue-400'/>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <DeleteIcon onClick={() => handleDelete(row._id)} className="cursor-pointer text-red-400" />
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>Edit Account</DialogTitle>
                    <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
                        <Grid container spacing={2} sx={{ mt: '5px' }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Bank Name"
                                    fullWidth
                                    value={selectedRow?.accountName || ""}
                                    onChange={(e) => handleInputChange("accountName", e.target.value)}
                                    InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Total Balance"
                                    fullWidth
                                    value={selectedRow?.TotalBalance || ""}
                                    onChange={(e) => handleInputChange("TotalBalance", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    Currency: {selectedRow?.currency || "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: theme.palette.background.alt, padding: '1rem' }}>
                        <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ marginRight: '0.5rem' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

export default Accounts;
