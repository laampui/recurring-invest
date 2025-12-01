interface HistoricalData {
  [date: string]: {
    '4. close': string;
  };
}

export function calculateInvestment(
    historicalData: HistoricalData,
    amount: number,
    frequency: "monthly" | "weekly",
    periodInYears?: number | undefined,
    startDate?: Date | undefined,
    endDate?: Date | undefined
) {
  const finalEndDate = endDate ? new Date(endDate) : new Date();
  let finalStartDate = new Date();

  if (startDate) {
    finalStartDate = new Date(startDate);
  } else if (periodInYears) {
    finalStartDate.setFullYear(finalEndDate.getFullYear() - periodInYears);
  } else {
    // Default to 5 years if no period or start date is provided
    finalStartDate.setFullYear(finalEndDate.getFullYear() - 5);
  }

  let totalInvested = 0;
  let shares = 0;
  const chartData: { date: string; value: number }[] = [];

  const dates = Object.keys(historicalData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const nextInvestmentDate = new Date(finalStartDate);

  for (const dateStr of dates) {
    const currentDate = new Date(dateStr);
    if (currentDate >= finalStartDate && currentDate <= finalEndDate) {
      if (currentDate >= nextInvestmentDate) {
        const closePrice = parseFloat(historicalData[dateStr]['4. close']);
        if (!isNaN(closePrice)) {
          shares += amount / closePrice;
          totalInvested += amount;
        }

        if (frequency === 'monthly') {
          nextInvestmentDate.setMonth(nextInvestmentDate.getMonth() + 1);
        } else {
          nextInvestmentDate.setDate(nextInvestmentDate.getDate() + 7);
        }
      }

      const currentValue = shares * parseFloat(historicalData[dateStr]['4. close']);
      chartData.push({ date: dateStr, value: currentValue });
    }
  }

  const lastDate = dates[dates.length - 1];
  const finalValue = shares * parseFloat(historicalData[lastDate]['4. close']);
  const profit = finalValue - totalInvested;

  return {
    chartData,
    summary: {
      totalInvested,
      finalValue,
      profit,
    },
  };
}
