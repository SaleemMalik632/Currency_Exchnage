import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";

const OverviewChart = ({ data, isLoading, isDashboard = false }) => {
  const theme = useTheme();
  console.log("data here is all the profit ", data);

  // List of all months for x-axis
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Process data, replacing null profits with 0 for missing months
  const processedData = useMemo(() => {
    if (!data) return [];
    return allMonths.map((month) => {
      // Find data for current month
      const monthData = data[0]?.data?.find(d => d.x === month);
      const value = monthData?.y;
      return {
        x: month,
        y: isNaN(value) ? 0 : value // Convert NaN to 0
      };
    });
  }, [data]);

  const hasData = processedData.some(d => d.y > 0);
  console.log("processedData", processedData);
  if (isLoading) return "Loading...";

  return hasData ? (
    <ResponsiveLine
      data={[
        {
          id: "Profit",
          color: theme.palette.secondary.main,
          data: processedData.map(d => ({
            x: d.x,
            y: isNaN(d.y) ? 0 : d.y // Handle any NaN values
          }))
        },
      ]}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }} // Explicitly define x-axis scale
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => v,
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Profit",
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 30,
              translateY: -40,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]
          : undefined
      }
    />
  ) : (
    <div style={{ textAlign: "center", padding: "20px", color: theme.palette.secondary[200] }}>
      No data available to display.
    </div>
  );
};

export default OverviewChart;
