import React from 'react';
import FlexBetween from 'components/FlexBetween';
import TransactionForm from 'components/TransactionForm';
import Header from 'components/Header';
import {
    DownloadOutlined,
    AddCircleOutline,
    Email,
    PointOfSale,
    PersonAdd,
    Traffic
} from '@mui/icons-material';
import {
    Box,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import BreakdownChart from 'components/BreakdownChart';
import OverviewChart from 'components/OverviewChart';
import { useGetDashboardQuery } from 'state/api';
import StatBox from 'components/StatBox';

import { styled } from '@mui/material/styles';


const Dashboard = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const { data, isLoading } = useGetDashboardQuery();

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
            headerName: "Products",
            flex: 1,
            sortable: false,
            renderCell: (params) => params.value.length
        }, {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
        },

    ];






    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header
                    title="New Transaction" subtitle="Create a new transaction"
                />
            </FlexBetween>

            <TransactionForm currency="ATZ" />
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

                {/* ROW 2 */}
                <Box
                    gridColumn="span 7"
                    gridRow="span 3"
                    sx={{
                        overflow: 'auto', // Enables scrolling if content exceeds width or height
                        "& .MuiDataGrid-root": {
                            border: "none",
                            borderRadius: "5rem",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme.palette.background.alt,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderTop: "none",
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${theme.palette.secondary[200]} !important`,
                        },
                    }}
                >
                    <DataGrid
                        loading={isLoading || !data}
                        getRowId={(row) => row._id}
                        rows={(data && data.transactions) || []}
                        columns={columns}
                    />
                </Box>


                <Box
                    gridColumn="span 5"
                    gridRow="span 3"
                    backgroundColor={theme.palette.background.alt}
                    p="2rem"
                    borderRadius="0.55rem"
                >
                    <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
                        TZS to Omani Rial Exchange Report
                    </Typography>
                    {/* <BreakdownChart isDashboard={true} /> */}
                    <OverviewChart view="sales" />
                    <Typography
                        p="0 0.6rem"
                        fontSize="0.8rem"
                        sx={{ color: theme.palette.secondary[200] }}
                    >
                    </Typography>
                </Box>




            </Box>

        </Box>

    );
};

export default Dashboard;