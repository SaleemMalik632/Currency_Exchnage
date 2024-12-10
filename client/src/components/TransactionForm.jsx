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
  useMediaQuery,
  Typography,
} from '@mui/material';
import {
  useGetBanksByCurrencyQuery,
  useAddTransactionMutation,
  useCancelTransactionMutation,
  useGetAllCompletedTransactionsQuery,
  useGetAllCanceledTransactionsQuery,
  useFetchTransactionCountQuery
} from 'state/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import InvoicePDF from 'components/TransectionReceet';


const TransactionForm = ({ CheckINBankCurrency, CheckOutBankCurrency }) => {
  // Transaction Information
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // Sender Information
  const [senderName, setSenderName] = useState('');
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');
  // Payment Information
  const [amount, setAmount] = useState('');
  const [transactionFee, setTransactionFee] = useState(0);
  const [yourExchangeRate, setYourExchangeRate] = useState('');
  // Bank Information
  const [cashInBank, setCashInBank] = useState('');
  const [cashOutBank, setCashOutBank] = useState('');
  // Calculated fields
  const [amountInLocalCurrency, setAmountInLocalCurrency] = useState('');
  const [TotalOMR, setTotalOMR] = useState('');
  // banks remaining balance
  const [TotalcashIN, setTotalcashIN] = useState('');
  const [Totalcashout, setTotalcashout] = useState('');
  // transection Count 
  const [transectionCount, setTransectionCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility

  //  balance after Transe
  const [TotalcheckinAfterTransection, setTotalcheckinAfterTransection] = useState('');
  const [TotalcheckoutAfterTransection, setTotalcheckoutAfterTransection] = useState('');

  //  show the Invove report dialog
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  // Fetch transaction count query
  const { data: transactionCountData, refetch } = useFetchTransactionCountQuery();

  // Function to load the transaction count
  const loadTransactionCount = async () => {
    try {
      const { data } = await refetch();
      console.log('Transaction Count:', data);
      setTransectionCount(data);
      setInvoiceNumber('INV-' + data); // Generate new invoice number
    } catch (error) {
      console.error('Error fetching transaction count:', error);
      alert('Error fetching transaction count');
    }
  };

  // Run loadTransactionCount on initial load and when currency changes
  useEffect(() => {
    loadTransactionCount();
  }, [CheckINBankCurrency, CheckOutBankCurrency, transectionCount]); // Currency change triggers count reload

  const handleOpenDialog = () => setOpenDialog(true);  // Open the dialog
  const handleCloseDialog = () => setOpenDialog(false); // Close the dialog


  // Labels that change based on the selected currency
  const [labels, setLabels] = React.useState({});
  const generateLabels = (from, to) => ({
    amountLabel: `Amount in ${from}`,
    transactionFeeLabel: `Transaction Fee (in ${from})`,
    exchangeRateLabel: `Your Exchange Rate (${from} to ${to})`,
    marketRateLabel: `Market Rate (${from} to ${to})`,
    amountInLocalCurrencyLabel: `Amount in ${to}`,
    TototalOmni: `Total ${from}`,
    TotalcashIN_: `Total Cashin ${from}`,
    Totalcashout_: `Total Cashout ${to}`,
    CheckinBalanceAfterTransection: `Total Balance After Transection  ${from}`,
    CheckoutBalanceAfterTransection: `Total Balance After Transection ${to}`

  });
  useEffect(() => {
    if (CheckINBankCurrency === 'Omani') {
      setLabels(generateLabels(CheckINBankCurrency, CheckOutBankCurrency));
      setCashInBank(''); // Reset to allow selection
      setCashOutBank('Amour-Ahmed'); // Set default cash-out bank
    } else if (CheckINBankCurrency === 'TZS') {
      setLabels(generateLabels('TZS', 'OMR'));
      setCashInBank('Amour-Ahmed'); // Set default cash-in bank
      setCashOutBank(''); // Reset to allow selection
    }
  }, [CheckINBankCurrency, CheckOutBankCurrency]);

  const { data: CheckINBankCurrencyData, refetch: refetchIN, isFetching: isFetchingIN } =
    useGetBanksByCurrencyQuery(CheckINBankCurrency, { skip: !CheckINBankCurrency });
  const { data: CheckOutBankCurrencyData, refetch: refetchOUT, isFetching: isFetchingOUT } =
    useGetBanksByCurrencyQuery(CheckOutBankCurrency, { skip: !CheckOutBankCurrency });
  useEffect(() => {
    if (CheckINBankCurrency) refetchIN();

  }, [CheckINBankCurrency, transectionCount, refetchIN]);
  useEffect(() => {
    if (CheckOutBankCurrency) refetchOUT();
  }, [CheckOutBankCurrency, transectionCount, refetchOUT]);
  if (isFetchingIN || isFetchingOUT) {
    console.log("Fetching bank data...");
  }
  const CheckINBankList = CheckINBankCurrencyData?.accounts.map(account => account.accountName) || [];
  const checkoutOMRList = CheckOutBankCurrencyData?.accounts.map(account => account.accountName) || [];

  // get the total balace of selcted checkin bank
  useEffect(() => {
    if (CheckINBankCurrencyData) {
      const selectedBankData = CheckINBankCurrencyData.accounts.find((bank) => bank.accountName === cashInBank);
      setTotalcashIN(selectedBankData?.TotalBalance || 0);
    }
  }, [cashInBank, CheckINBankCurrencyData]);
  // get the total balace of selcted checkout bank
  useEffect(() => {
    if (CheckOutBankCurrencyData) {
      const selectedBankData = CheckOutBankCurrencyData.accounts.find((bank) => bank.accountName === cashOutBank);
      setTotalcashout(selectedBankData?.TotalBalance || 0);
    }
  }, [cashOutBank, CheckOutBankCurrencyData]);

  const [addTransaction] = useAddTransactionMutation();



  // Update the form labels and banks based on the selected currency
  useEffect(() => {
    //  clear all the fields
    setInvoiceNumber('');
    setSenderName('');
    setSenderPhoneNumber('');
    setReceiverName('');
    setReceiverPhoneNumber('');
    setAmount('');
    setTransactionFee(0);
    setYourExchangeRate('');
    setAmountInLocalCurrency('');
    setTotalOMR('');
    setTotalcashIN('');
    setTotalcashout('');
    setCashInBank('');
    setCashOutBank('');
    setInvoiceNumber('');
  }, [CheckINBankCurrency, CheckOutBankCurrency]);


  useEffect(() => {
    const formatNumber = (num) => {
      return parseFloat(num).toString();
    };

    let totalAmmount = 0;
    if (CheckINBankCurrency === 'Omani') {
      setAmountInLocalCurrency(formatNumber((amount * yourExchangeRate).toFixed(3)));
      totalAmmount = parseFloat(amount) + parseFloat(transactionFee);
      setTotalOMR(formatNumber(totalAmmount.toFixed(3)));
      console.log('totalAmmount:', totalAmmount);
    } else if (CheckINBankCurrency === 'TZS') {
      totalAmmount = amount;
      setAmountInLocalCurrency(formatNumber((amount / yourExchangeRate).toFixed(3)));
      console.log('totalAmmount:', totalAmmount);
    }
    console.log('Totalcashout:', Totalcashout);
    console.log('TotalcashIN:', TotalcashIN);
    setTotalcheckinAfterTransection(formatNumber((parseFloat(TotalcashIN) + parseFloat(totalAmmount)).toFixed(3)));
    setTotalcheckoutAfterTransection(formatNumber((parseFloat(Totalcashout) - parseFloat(amountInLocalCurrency)).toFixed(3)));
  }, [amount, yourExchangeRate, transactionFee, CheckINBankCurrency, TotalcashIN, Totalcashout, amountInLocalCurrency]);
  
  
  
  const refreshTransection = async () => {
    await refetchIN();
    await refetchOUT();
    setTransectionCount((prev) => prev + 1);
    setInvoiceNumber('');
    setDate(new Date().toISOString().split('T')[0]);
    setSenderName('');
    setSenderPhoneNumber('');
    setReceiverName('');
    setReceiverPhoneNumber('');
    setAmount('');
    setTransactionFee(0);
    setYourExchangeRate('');
    setAmountInLocalCurrency('');
    setTotalOMR(0);
    setTotalcashIN('');
    setTotalcashout('');
    setCashInBank('');
    setCashOutBank('');
  };

  const handleConfirmTransaction = async (isCancel = false) => {
    handleCloseDialog(); // Close the dialog after confirmation
    console.log('isCancel:', isCancel); // Debugging line to check the value of isCancel
    try {
      await addTransaction({
        invoiceNumber,
        date,
        senderName,
        senderPhoneNumber,
        receiverName,
        receiverPhoneNumber,
        AmmountCheckin: amount,
        transactionFee: transactionFee,
        TotalAfterFee: TotalOMR,
        exchangeRate: yourExchangeRate,
        NameofCashInBank: cashInBank,
        NameofCashOutBank: cashOutBank,
        RemainingBalanceCheckInBank: TotalcashIN,
        RemainingBalanceCheckOutBank: Totalcashout,
        NameofCheckInCurrency: CheckINBankCurrency,
        NameofCheckOutCurrency: CheckOutBankCurrency,
        AmmountCheckout: amountInLocalCurrency,
        isCancel: isCancel,
      });
      if (!isCancel) {
        alert(isCancel ? 'Transaction canceled' : 'Transaction submitted successfully');
      }
      console.log('Invoice Data:', {
        invoiceNumber,
        senderName,
        senderPhoneNumber,
        receiverName,
        receiverPhoneNumber,
        amount,
        yourExchangeRate,
        amountInLocalCurrency,
        transactionFee,
      });

      // Update state variables before opening the dialog
      setInvoiceData({
        invoiceNumber,
        senderName,
        senderPhoneNumber,
        receiverName,
        receiverPhoneNumber,
        amount,
        yourExchangeRate,
        amountInLocalCurrency,
        transactionFee,  // Ensure transactionFee is included
      });

      setOpenInvoiceDialog(true); // Show invoice dialog after successful transaction
      refreshTransection();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Error submitting transaction');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !invoiceNumber || !date || !senderName || !senderPhoneNumber ||
      !receiverName || !receiverPhoneNumber || !amount ||
      !yourExchangeRate || !cashInBank || !cashOutBank
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    if (amountInLocalCurrency > Totalcashout) {
      handleOpenDialog(); // Show dialog if funds are insufficient
      return;
    }
    handleConfirmTransaction(); // Proceed with transaction if no issues
  };

  const theme = useTheme();
  const isNonMobile = useMediaQuery('(min-width:600px)');



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
        {/* Transaction Information Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              fullWidth
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        {/* Sender Information Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Bio Information
        </Typography>
        <Grid container spacing={2}>
          {/* Sender Information */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Sender Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Sender Phone Number"
                  value={senderPhoneNumber}
                  onChange={(e) => setSenderPhoneNumber(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Receiver Information */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Receiver Name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Receiver Phone Number"
                  value={receiverPhoneNumber}
                  onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Payment Information Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Payment Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              label={labels.amountLabel}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              label={labels.exchangeRateLabel}
              type="number"
              value={yourExchangeRate}
              onChange={(e) => setYourExchangeRate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <TextField
              label={labels.amountInLocalCurrencyLabel}
              value={amountInLocalCurrency}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          {
            CheckINBankCurrency === 'Omani' && (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                <TextField
                  label={labels.transactionFeeLabel}
                  type="number"
                  value={transactionFee}
                  onChange={(e) => setTransactionFee(e.target.value)}
                  fullWidth
                />
              </Grid>
            )
          }
          {
            CheckINBankCurrency === 'Omani' && (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                <TextField
                  label={labels.TototalOmni}
                  value={TotalOMR}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>
            )
          }
        </Grid>

        {/* Bank Information Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Bank Information
        </Typography>
        <Grid container spacing={2}>
          {/* Cash In Information */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="cashInBank-label">Check In Bank</InputLabel>
                  <Select
                    labelId="cashInBank-label"
                    value={cashInBank}
                    onChange={(e) => {
                      setCashInBank(e.target.value);
                      console.log('Selected bank: ' + e.target.value);
                    }}
                    label="Check In Bank"
                  >
                    {CheckINBankList.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={labels.TotalcashIN_}
                  type="number"
                  value={TotalcashIN}
                  onChange={(e) => setTotalcashIN(e.target.value)}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={labels.CheckinBalanceAfterTransection}
                  type="number"
                  value={TotalcheckinAfterTransection}
                  onChange={(e) => setTotalcheckinAfterTransection(e.target.value)}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Cash Out Information */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="cashOutBank-label">Check Out Bank</InputLabel>
                  <Select
                    labelId="cashOutBank-label"
                    value={cashOutBank}
                    onChange={(e) => setCashOutBank(e.target.value)}
                    label="Check Out Bank"
                  >
                    {checkoutOMRList.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={labels.Totalcashout_}
                  value={Totalcashout}
                  type="number"
                  onChange={(e) => setTotalcashout(e.target.value)}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={labels.CheckoutBalanceAfterTransection}
                  value={TotalcheckoutAfterTransection}
                  type="number"
                  onChange={(e) => setTotalcheckoutAfterTransection(e.target.value)}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Submit Transaction
        </Button>
      </form>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Insufficient Funds</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have insufficient funds in the selected bank. Do you still want to proceed with this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleConfirmTransaction(true)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConfirmTransaction(false)}
            sx={{ borderRadius: 2 }}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
      {/* Invoice Dialog */}
      <div>
        {/* <Button variant="outlined" onClick={() => setOpenInvoiceDialog(true)}>
          Open Invoice Dialog
        </Button> */}
        <Dialog
          open={openInvoiceDialog}
          onClose={() => setOpenInvoiceDialog(false)}
          PaperProps={{
            sx: {
              p: 4,
              backgroundColor: theme.palette.background.alt,
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle>Invoice Report</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <InvoicePDF
                invoiceNumber={invoiceData.invoiceNumber}
                senderName={invoiceData.senderName}
                senderNumber={invoiceData.senderPhoneNumber}
                receiverName={invoiceData.receiverName}
                receiverNumber={invoiceData.receiverPhoneNumber}
                amountSend={invoiceData.amount}
                rate={invoiceData.yourExchangeRate}
                amountReceive={invoiceData.amountInLocalCurrency}
                chargeFee={invoiceData.transactionFee ?? 0}  // Ensure chargeFee is passed and default to 0 if undefined
                total={parseFloat(invoiceData.amount) + parseFloat(CheckINBankCurrency === 'TZS' ? 0 : (invoiceData.transactionFee ?? 0))}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => setOpenInvoiceDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>



    </Box>
  );
};

export default TransactionForm;