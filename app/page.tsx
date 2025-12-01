'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalculatorForm from './components/calculator-form';
import ResultChart from './components/result-chart';
import Summary from './components/summary';

interface ChartData {
  date: string;
  value: number;
}

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [summaryData, setSummaryData] = useState({
    totalInvested: 0,
    finalValue: 0,
    profit: 0,
  });
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (newChartData: ChartData[], newSummaryData: any) => {
    setChartData(newChartData);
    setSummaryData(newSummaryData);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-6xl flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Recurring Investment Calculator
        </h1>
        <div className={`w-full flex-grow flex flex-col md:flex-row items-start ${showResults ? 'justify-start' : 'justify-center'}`}>
          <motion.div
            layout
            transition={{ duration: 0.7, type: 'spring' }}
            className={`${showResults ? 'w-full md:w-1/3' : 'w-full md:w-1/2'}`}
          >
            <CalculatorForm onCalculate={handleCalculate} onReset={handleReset} />
          </motion.div>
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full md:w-2/3"
              >
                <div className="mt-8 md:mt-0 md:ml-8">
                  <ResultChart data={chartData} />
                  <div className="mt-4">
                    <Summary {...summaryData} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
