import React, { useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, useTheme } from '@mui/material';
import { useGetAllCompletedTransactionsQuery } from 'state/api';

const BreakdownChart = ({ Currany, isDashboard = false }) => {
    const { data: completedTransactions, isLoading, refetch: refetchIN } = useGetAllCompletedTransactionsQuery();
    const theme = useTheme();

    useEffect(() => {
        refetchIN();
    }, [Currany, refetchIN]);

    if (!completedTransactions || isLoading) return 'Loading...';

    const colors = [
        theme.palette.secondary[500],
        theme.palette.primary[300],
        theme.palette.error[500],
        theme.palette.warning[500],
    ];

    // Aggregate data for the chart
    const aggregatedData = completedTransactions.reduce((acc, transaction) => {
        const checkInCurrency = transaction.NameofCheckInCurrency === 'Omani' ? 'OMR' : transaction.NameofCheckInCurrency;
        const checkOutCurrency = transaction.NameofCheckOutCurrency === 'Omani' ? 'OMR' : transaction.NameofCheckOutCurrency;
        const category = `${checkInCurrency} to ${checkOutCurrency}`;

        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += parseFloat(transaction.AmmountCheckin);

        return acc;
    }, {});

    console.log('Aggregated Data:', aggregatedData);

    // Format data for the chart
    const formattedData = Object.entries(aggregatedData).map(([category, amount], i) => ({
        id: category,
        label: category,
        value: amount,
        color: colors[i % colors.length],
    }));

    console.log('Formatted Data for Chart:', formattedData);

    return (
        <Box
            height={isDashboard ? '400px' : '100%'}
            width="100%"
            minHeight={isDashboard ? '325px' : undefined}
            minWidth={isDashboard ? '325px' : undefined}
            position="relative"
        >
            <ResponsivePie
                data={formattedData}
                theme={{
                    axis: {
                        domain: { line: { stroke: theme.palette.secondary[200] } },
                        legend: { text: { fill: theme.palette.secondary[200] } },
                        ticks: {
                            line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
                            text: { fill: theme.palette.secondary[200] },
                        },
                    },
                    legends: { text: { fill: theme.palette.secondary[200] } },
                    tooltip: { container: { color: theme.palette.primary.main } },
                }}
                colors={{ datum: 'data.color' }}
                margin={
                    isDashboard
                        ? { top: 40, right: 80, bottom: 100, left: 50 }
                        : { top: 40, right: 80, bottom: 80, left: 80 }
                }
                sortByValue={true}
                innerRadius={0.45}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={!isDashboard}
                arcLinkLabelsTextColor={theme.palette.secondary[200]}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={0} // Ensure all labels are shown
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: isDashboard ? 20 : 0,
                        translateY: isDashboard ? 50 : 56,
                        itemsSpacing: 10,
                        itemWidth: 85,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: { itemTextColor: theme.palette.primary[500] },
                            },
                        ],
                    },
                ]}
            />
        </Box>
    );
};

export default BreakdownChart;
