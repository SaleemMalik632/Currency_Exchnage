import React, { useEffect, useState, useMemo } from 'react';
import { useGetDoneTransactionByCheckInCurrencyQuery, useGetAllCompletedTransactionsQuery, useGetBanksByCurrencyQuery, useGetExpanceDataQuery } from 'state/api';
import { Card, CardBody, Typography, CardHeader, Select, Option } from "@material-tailwind/react";
import { Box } from "@mui/material";
import Datepicker from "react-tailwindcss-datepicker";
import { useTheme } from "@mui/material/styles";
import {
    MonetizationOn,
    ShoppingCart,
    AttachMoney,
    TrendingUp,
    TrendingDown,
    AccountBalance,
    LocalAtm,
    Money,
} from '@mui/icons-material';

import StatBox from 'components/StatBox';

const COLUMN_KEYS = ['invoiceNumber', 'senderPhoneNumber', 'receiverPhoneNumber', 'AmmountCheckin', 'transactionFee', 'TotalAfterFee', 'exchangeRate', 'AmmountCheckout'];
const TABLE_HEAD = ['Invoice #', 'Sender Phone', 'Receiver Phone', 'Amount', 'Fee', 'Total', 'Rate', 'Check-Out Amount'];

const ProfileCalculation = ({ CheckINCurrancy, bankName }) => {
    
    const { data: accountsData, error: accountsError, isLoading: accountsLoading } = useGetBanksByCurrencyQuery('Omani');
    const [SelectedBank, setSelectedBank] = useState('');
    useEffect(() => {
        if (accountsData && accountsData.accounts && accountsData.accounts.length > 0 && !SelectedBank) {
            setSelectedBank(accountsData.accounts[0].accountName); // Set default bank if not already selected
        }
    }, [accountsData, SelectedBank]);
    console.log('accountsData:', accountsData ? accountsData.accounts : "No data");

    const { data: allCompletedTransactions, isLoading: loadingAll } = useGetAllCompletedTransactionsQuery();
    console.log('allCompletedTransactions:', allCompletedTransactions);
    const { data: allExpanceData, isLoading: loadingExpance } = useGetExpanceDataQuery();
    console.log('allExpanceData:', allExpanceData);

    const [value, setValue] = useState({
        startDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        endDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    });

    const [totalTZSBuy, setTotalTZSBuy] = useState(0);
    const [totalTZSSale, setTotalTZSSale] = useState(0);
    const [RemainingTZS, setRemainingTZS] = useState(0);
    const [proportionalCostSoldTZS, setProportionalCostSoldTZS] = useState(0);
    const [ProfitOmani, setProfitOmani] = useState(0);
    const [Profitwithfee, setProfitwithfee] = useState(0);
    const [MyTotalOmaniEnvestment, setMyTotalOmaniEnvestment] = useState(0);
    const [RevenewAfterSaleOmanitoTZS, setRevenewAfterSaleOmanitoTZS] = useState(0);
    const [AllTransectionFee, setAllTransectionFee] = useState(0);
    const [TodayExpance, setTodayExpance] = useState(0);

    useEffect(() => {
        if (value.startDate && value.endDate) {
            filterTransactions();
        }
    }, [value, allCompletedTransactions,allExpanceData]);

    const filterTransactions = () => {
        console.log("Start Date (from Datepicker):", value.startDate); // Logs start date
        console.log("End Date (from Datepicker):", value.endDate); // Logs end date

        const startDate = new Date(value.startDate); // Convert Datepicker start date to Date object
        const endDate = new Date(value.endDate); // Convert Datepicker end date to Date object
        endDate.setHours(23, 59, 59, 999);
        if (!allCompletedTransactions) {
           alert("No transactions found");
           return;
        }
        console.log('startDate:', startDate);
        console.log('endDate:', endDate);
        
        // using  getallCompletedTransactions to get the all completed transactions
        const TransectionWithRange = allCompletedTransactions?.filter(transaction => {
            console.log("Transaction Date (saved in DB):", transaction.date); // Logs the transaction date
            const transactionDate = new Date(transaction.date); // Convert DB date string to Date object
            return transactionDate >= startDate && transactionDate <= endDate;
        });
        console.log("Filtered Transactions (within range):", TransectionWithRange);
        
        // using getExpanceData to get the expance of the selected date
        if (allExpanceData && allExpanceData.allExpancesData?.length > 0) {
            const ExpanceWithRange = allExpanceData.allExpancesData.filter(expance => {
                console.log("Expance Date (saved in DB):", expance.ExpanceDate); // Logs the expense date
                const expanceDate = new Date(expance.ExpanceDate); // Convert DB date string to Date object
                return expanceDate >= startDate && expanceDate <= endDate;
            });
            console.log("Filtered Expance (within range):", ExpanceWithRange);
            const totalAmount_Expancee = ExpanceWithRange.reduce((acc, expance) => acc + expance.ExpanceAmount, 0);
            console.log("Total Expance Amount:", totalAmount_Expancee);
            setTodayExpance(totalAmount_Expancee);

            if (ExpanceWithRange.length === 0) {
                console.log("No expenses found in the specified range.");
                setTodayExpance(0); // Set total expense to zero if no values are found
            }
        } else {
            console.log("No expenses data available or data is empty.");
            setTodayExpance(0); // Set total expense to zero if no data is available
        }

        const BuysTZS = TransectionWithRange?.filter(transaction => transaction.NameofCheckOutCurrency === "Omani");
        console.log('BuysTZS:', BuysTZS);

        const SaleTZS = TransectionWithRange?.filter(transaction => transaction.NameofCheckInCurrency === "Omani");
        console.log('SaleTZS:', SaleTZS);

        const allTransectionFee = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.transactionFee, 0) || 0).toFixed(3));
        setAllTransectionFee(allTransectionFee);
        console.log('AllTransectionFee:', allTransectionFee);

        // Total OMR spent on buying TZS (TZS to OMR) 
        const myTotalOmaniEnvestment = parseFloat((BuysTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0).toFixed(3));
        setMyTotalOmaniEnvestment(myTotalOmaniEnvestment);
        console.log('MyTotalOmaniEnvestment:', myTotalOmaniEnvestment);

        // total TZS that i bought
        const totalTZSBuy = parseFloat((BuysTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0).toFixed(3));
        setTotalTZSBuy(totalTZSBuy);

        // Amount after selling TZS
        const revenewAfterSaleOmanitoTZS = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0).toFixed(3));
        setRevenewAfterSaleOmanitoTZS(revenewAfterSaleOmanitoTZS);
        console.log("RevenewAfterSaleOmanitoTZS", revenewAfterSaleOmanitoTZS);

        // Total TZS sold
        const totalTZSSale = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0).toFixed(3));
        setTotalTZSSale(totalTZSSale);

        const remainingTZS = parseFloat((totalTZSBuy - totalTZSSale).toFixed(3));
        setRemainingTZS(remainingTZS);

        const proportionalCostSoldTZS = parseFloat(((totalTZSSale / totalTZSBuy) * myTotalOmaniEnvestment).toFixed(3));
        setProportionalCostSoldTZS(proportionalCostSoldTZS);

        const profitOmani = parseFloat((revenewAfterSaleOmanitoTZS - proportionalCostSoldTZS).toFixed(3));
        setProfitOmani(profitOmani);

        const profitwithfee = parseFloat((profitOmani + allTransectionFee).toFixed(3));
        setProfitwithfee(profitwithfee);

        console.log('ProfitOmani:', profitOmani);
        console.log('Profitwithfee:', profitwithfee);
        console.log('Total TZS Bought:', totalTZSBuy);
        console.log('Total TZS Sold:', totalTZSSale);
        console.log('Remaining TZS:', remainingTZS);
        console.log('proportionalCostSoldTZS:', proportionalCostSoldTZS);
        console.log("RevenewAfterSaleOmanitoTZS", revenewAfterSaleOmanitoTZS);
        console.log('MyTotalOmaniEnvestment:', myTotalOmaniEnvestment);
        console.log('AllTransectionFee:', allTransectionFee);
        console.log('TodayExpance:', TodayExpance);
    };



    const { data: doneTransactions, isLoading: loadingDone, refetch: refetchIN } =
        useGetDoneTransactionByCheckInCurrencyQuery(CheckINCurrancy, { skip: !CheckINCurrancy });
    const [searchColumn, setSearchColumn] = useState(COLUMN_KEYS[0]);
    const [searchValue, setSearchValue] = useState("");
    const theme = useTheme();

    useEffect(() => {
        if (CheckINCurrancy) {
            refetchIN();
        }
    }, [CheckINCurrancy, refetchIN]);

    // in the Complete Transtion show only the trnaction in whihc chekin or chekc out is bank is selectedbank 
    const CompleteTransections = allCompletedTransactions?.filter(transaction => transaction.NameofCashInBank === SelectedBank || transaction.NameofCashOutBank === SelectedBank);

    // using  getallCompletedTransactions to get the all completed transactions
    const TransectionWithRange = allCompletedTransactions?.filter(transaction => {
        console.log("Transaction Date (saved in DB):", transaction.date); // Logs the transaction date
        const transactionDate = new Date(transaction.date); // Convert DB date string to Date object
        return transactionDate >= value.startDate && transactionDate <= value.endDate;
    });
    const completedTransactions = TransectionWithRange;
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

    return (
        <div
            className="container mx-auto  p-2 h-full w-full     "
            sx={{
                backgroundColor: theme.palette.background.alt,
                boxShadow: theme.shadows[4],
                maxHeight: '190vh',
                overflow: 'scroll',
            }}
        >
            <Box
                className="container mx-auto px-4  h-full w-full"
                sx={{
                    maxHeight: '190vh',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                }}
            >
                <Card className="mx-auto h-full w-full">
                    <div className='mx-auto h-full w-full'>
                        <CardHeader floated={false} shadow={false} className="rounded-none   h-full ">
                            <Typography variant="h5" color="blue-gray" className="font-bold text-center sm:text-left">
                                Profit Details Of All Transactions
                            </Typography>
                            <div className="flex flex-col items-center sm:items-start mt-6 w-full">
                                {/* First Row */}
                                <div className="flex flex-col sm:flex-row w-full gap-6 justify-between">
                                    <StatBox title="Total (TZS) Bought" value={totalTZSBuy} icon={<ShoppingCart sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Total (TZS) Sold" value={totalTZSSale} icon={<TrendingDown sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Remaining (TZS)" value={RemainingTZS} icon={<AccountBalance sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Cost of Sold TZS (OMR)" value={proportionalCostSoldTZS} icon={<Money sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title={"Transaction Fee (OMR)"} value={AllTransectionFee} icon={<AccountBalance sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                </div>
                                {/* Second Row */}
                                <div className="flex flex-col sm:flex-row w-full gap-6 justify-between mt-4">
                                    <StatBox title="Profit (OMR)" value={Profitwithfee} icon={<TrendingUp sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Expances" value={TodayExpance} icon={<Money sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title={"Profit After Expances"} value={Profitwithfee - TodayExpance} icon={<Money sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Total Envestment (OMR)" value={MyTotalOmaniEnvestment} icon={<AccountBalance sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                    <StatBox title="Total Revenue (OMR)" value={RevenewAfterSaleOmanitoTZS} icon={<Money sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                                </div>
                            </div>
                        </CardHeader>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:absolute sm:top-5 sm:right-0">
                        <div className="relative z-50 caret-lime-700
                         "
                            sx={{
                                backgroundColor: '#1f2937', // gray-800
                                borderColor: '#055fdc', // gray-600
                                color: '#ffffff',
                                borderWidth: '5px',
                            }}>
                            <Datepicker
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                showShortcuts={true}

                            />
                        </div>
                    </div>

                    <CardBody className="px-4">
                        <div className="overflow-auto" style={{ maxHeight: '50vh' }}>
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
            </Box>
        </div>
    );
};

export default ProfileCalculation;