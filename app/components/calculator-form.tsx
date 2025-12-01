'use client';

import { useState } from 'react';
import { getDailyAdjusted } from '../lib/alpha-vantage';
import { calculateInvestment } from '../lib/calculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface CalculatorFormProps {
  onCalculate: (chartData: any[], summary: any) => void;
  onReset: () => void;
}

export default function CalculatorForm({ onCalculate, onReset }: CalculatorFormProps) {
  const [symbol, setSymbol] = useState('SPY');
  const [amount, setAmount] = useState<number>();
  const [frequency, setFrequency] = useState<'monthly' | 'weekly'>('monthly');
  const [period, setPeriod] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(Number(e.target.value));
    if (dateRange) {
      setDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (period) {
      setPeriod(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const historicalData = await getDailyAdjusted(symbol);
      const { chartData, summary } = calculateInvestment(
        historicalData,
        amount!,
        frequency,
        period,
        dateRange?.from,
        dateRange?.to
      );
      onCalculate(chartData, summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount(undefined);
    setPeriod(5);
    setDateRange(undefined);
    onReset();
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger id="symbol">
                <SelectValue placeholder="Select a symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPY">SPY</SelectItem>
                <SelectItem value="VOO">VOO</SelectItem>
              <SelectItem value="QQQ">QQQ</SelectItem>
              <SelectItem value="VGT">VGT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 1000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as 'monthly' | 'weekly')}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown"
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  toDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Period (Years)</Label>
            <Input
              id="period"
              type="number"
              value={period || ''}
              onChange={handlePeriodChange}
              disabled={!!dateRange}
              className="disabled:bg-gray-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading || !amount} className="w-full">
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="w-full">
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
