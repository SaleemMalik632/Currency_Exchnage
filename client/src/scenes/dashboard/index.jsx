import React, { useState, useEffect ,useMemo} from 'react'; // Add useState and useEffect
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  MonetizationOn,
  TrendingUpOutlined,
} from '@mui/icons-material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";



import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  Alert
} from "@mui/material"; // Import Select and MenuItem for dropdown
import { DataGrid } from '@mui/x-data-grid';
import BreakdownChart from 'components/BreakdownChart';
import OverviewChart from 'components/OverviewChart';
import { useGetDashboardQuery, useGetAllCompletedTransactionsQuery, useGetExpanceDataQuery,useFetchTransactionCountQuery } from 'state/api';
import StatBox from 'components/StatBox';
import ViewAllTransections from 'components/AllTransecttions';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [selectedCurrency, setSelectedCurrency] = useState('Omani'); // Default to Omani
  const { data } = useGetDashboardQuery(selectedCurrency); // Pass selectedCurrency to the API query

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  // useEffect(() => {
  //   alert(`Selected Currency: ${selectedCurrency}`); // Alert the selected currency
  // }, [selectedCurrency]);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User Id",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length
    }, {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

   // Fetch transaction count query
// Fetch data for transactions and expenses
const { data: allCompletedTransactions, isLoading: isTransactionsLoading } = useGetAllCompletedTransactionsQuery();
const { data: allExpanceData, isLoading: isExpanceDataLoading } = useGetExpanceDataQuery();

// State variables
const [TodayExpance, setTodayExpance] = useState(0);
const [profitToday, setProfitToday] = useState(0);
const [profitLastMonth, setProfitLastMonth] = useState(0);
const [profitLastYear, setProfitLastYear] = useState(0);
const [monthlyProfits, setMonthlyProfits] = useState([]);
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

// Utility function to get date ranges
const getDateRange = (rangeType) => {
  const today = new Date();
  let startDate, endDate;

  switch (rangeType) {
    case 'today':
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
      break;
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
  }

  return { startDate, endDate };
};

// Function to filter transactions and calculate profit
const filterTransactions = (startDate, endDate) => {
  endDate.setHours(23, 59, 59, 999);

  if (!allCompletedTransactions || allCompletedTransactions.length === 0) {
    console.warn("No transactions found");
    return 0;
  }

  // Filter transactions within the date range
  const TransectionWithRange = allCompletedTransactions?.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Filter expenses within the date range
  if (allExpanceData && allExpanceData.length > 0) {
    const ExpanceWithRange = allExpanceData.filter(expance => {
      const expanceDate = new Date(expance.ExpanceDate);
      return expanceDate >= startDate && expanceDate <= endDate;
    });
    const totalExpense = ExpanceWithRange.reduce((acc, expance) => acc + expance.ExpanceAmount, 0);
    setTodayExpance(totalExpense);

    if (ExpanceWithRange.length === 0) {
      console.warn("No expenses found in the specified range.");
      setTodayExpance(0);
    }
  } else {
    console.warn("No expenses data available.");
    setTodayExpance(0);
  }

  // Calculate profit
  const BuysTZS = TransectionWithRange?.filter(transaction => transaction.NameofCheckOutCurrency === "Omani");
  const SaleTZS = TransectionWithRange?.filter(transaction => transaction.NameofCheckInCurrency === "Omani");

  const allTransactionFee = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.transactionFee, 0) || 0).toFixed(3));
  setAllTransectionFee(allTransactionFee);

  const myTotalOmaniEnvestment = parseFloat((BuysTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0).toFixed(3));
  setMyTotalOmaniEnvestment(myTotalOmaniEnvestment);

  const totalTZSBuy = parseFloat((BuysTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0).toFixed(3));
  setTotalTZSBuy(totalTZSBuy);

  const revenewAfterSaleOmanitoTZS = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckin, 0) || 0).toFixed(3));
  setRevenewAfterSaleOmanitoTZS(revenewAfterSaleOmanitoTZS);

  const totalTZSSale = parseFloat((SaleTZS?.reduce((acc, transaction) => acc + transaction.AmmountCheckout, 0) || 0).toFixed(3));
  setTotalTZSSale(totalTZSSale);

  const remainingTZS = parseFloat((totalTZSBuy - totalTZSSale).toFixed(3));
  setRemainingTZS(remainingTZS);

  const proportionalCostSoldTZS = parseFloat(((totalTZSSale / totalTZSBuy) * myTotalOmaniEnvestment).toFixed(3));
  setProportionalCostSoldTZS(proportionalCostSoldTZS);

  const profitOmani = parseFloat((revenewAfterSaleOmanitoTZS - proportionalCostSoldTZS).toFixed(3));
  setProfitOmani(profitOmani);

  const profitwithfee = parseFloat((profitOmani + allTransactionFee).toFixed(3));
  setProfitwithfee(profitwithfee);

  console.log('ProfitOmani:', profitOmani);
  console.log('Profitwithfee:', profitwithfee);
  console.log('Total TZS Bought:', totalTZSBuy);
  console.log('Total TZS Sold:', totalTZSSale);
  console.log('Remaining TZS:', remainingTZS);
  console.log('proportionalCostSoldTZS:', proportionalCostSoldTZS);
  console.log("RevenewAfterSaleOmanitoTZS", revenewAfterSaleOmanitoTZS);
  console.log('MyTotalOmaniEnvestment:', myTotalOmaniEnvestment);
  console.log('AllTransectionFee:', allTransactionFee);
  console.log('TodayExpance:', TodayExpance);

  return profitwithfee;
};

// Fetch transaction count query
const [transectionCount, setTransectionCount] = useState(0);
const { data: transactionCountData, refetch } = useFetchTransactionCountQuery();
const loadTransactionCount = async () => {
  try {
    const { data } = await refetch();
    console.log('Transaction Count:', data);
    setTransectionCount(data);
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    alert('Error fetching transaction count');
  }
};
// Effect to calculate dashboard data once all data is loaded
useEffect(() => {
  if (!isTransactionsLoading && !isExpanceDataLoading && allCompletedTransactions && allExpanceData) {
    const todayRange = getDateRange('today');
    setProfitToday(filterTransactions(todayRange.startDate, todayRange.endDate));
    const lastMonthRange = getDateRange('thisMonth');
    setProfitLastMonth(filterTransactions(lastMonthRange.startDate, lastMonthRange.endDate));
    const lastYearRange = getDateRange('thisYear');
    setProfitLastYear(filterTransactions(lastYearRange.startDate, lastYearRange.endDate));
    loadTransactionCount();
    const today = new Date();
    const monthlyProfits = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(today.getFullYear(), month, 1);
      const endDate = new Date(today.getFullYear(), month + 1, 0);
      const profit = filterTransactions(startDate, endDate);
      monthlyProfits.push({ month: startDate.toLocaleString('default', { month: 'short' }), profit });
    }
    setMonthlyProfits(monthlyProfits);
  }
}, [isTransactionsLoading, isExpanceDataLoading, allCompletedTransactions, allExpanceData]);

const profitData = useMemo(() => {
  return [
    {
      id: "Profit",
      color: "hsl(220, 70%, 50%)",
      data: monthlyProfits.map(({ month, profit }) => ({ x: month, y: profit })),
    },
  ];
}, [monthlyProfits]);
  
console.log("Monthly Profits:", monthlyProfits);










  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="DASHBOARD" subtitle="Welcome to your dashboard"
        />
        <Box>
          <Select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            sx={{ marginRight: '10px' }} // Optional styling
          >
            <MenuItem value="Omani">OMR</MenuItem>
            <MenuItem value="TZS">TZS</MenuItem>
          </Select>
          {/* <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px"
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button> */}
        </Box>
      </FlexBetween>

      {/* Display Alert for Currency Change */}
      <Alert severity="info" sx={{ marginTop: '10px' }}>
        Current Selected Currency: {selectedCurrency}
      </Alert>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" }
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Transections"
          value={transectionCount}
          icon={
            <ReceiptLongIcon
              sx={{
                color: theme.palette.secondary[300], fontSize: "26px"
              }}
            />
          }
        />
        <StatBox
          title={`Profit Today in ${selectedCurrency}`}
          value={profitToday}
          icon={
            <TodayIcon
              sx={{
                color: theme.palette.secondary[300], fontSize: "26px"
              }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart data={profitData} isLoading={isTransactionsLoading || isExpanceDataLoading} view="sales" />
        </Box>
        <StatBox
          title={`Monthly Profit in ${selectedCurrency}`}
          value={profitLastMonth}
          icon={
            <DateRangeIcon
              sx={{
                color: theme.palette.secondary[300], fontSize: "26px"
              }}
            />
          }
        />
        <StatBox
          title={`Yearly Profit in ${selectedCurrency}`}
          value={profitLastYear}
          icon={
            <TrendingUpIcon
              sx={{
                color: theme.palette.secondary[300], fontSize: "26px"
              }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
        >
          <ViewAllTransections CheckINCurrancy={selectedCurrency} ></ViewAllTransections>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Breakdown of Transection by Currancy
          </Typography>
          <BreakdownChart isDashboard={true} Currany={selectedCurrency} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Total Amount for all Currancy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
