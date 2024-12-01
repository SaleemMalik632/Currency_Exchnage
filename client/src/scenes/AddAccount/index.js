import React, { useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import AddAddAccount from 'components/AddAccount';
import Header from 'components/Header';
import DespositAmmount from 'components/AccountInfo'; // Import your component

import {
    Box,
    useTheme,
    useMediaQuery,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

const AddAccount = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="Account Details" subtitle="Add Account Information" />

                <Box display="flex" gap="10px" alignItems="center">
                    <button
                        style={{
                            backgroundColor: theme.palette.primary.btn,
                            color: theme.palette.neutral.main,
                            fontWeight: "bold",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor = theme.palette.primary.light)
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = theme.palette.primary.btn)
                        }
                        onClick={handleOpenDialog} // Open dialog on click
                    >
                        Deposit
                    </button>
                </Box>
            </FlexBetween>

            <AddAddAccount currency={selectedCurrency} />

            {/* Popup Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Deposit Amount</DialogTitle>
                <DialogContent>
                    <DespositAmmount /> {/* Render DepositAmmount component */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddAccount;
