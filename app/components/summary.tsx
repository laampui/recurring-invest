'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryProps {
  totalInvested: number;
  finalValue: number;
  profit: number;
}

export default function Summary({ totalInvested, finalValue, profit }: SummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: finalValue > 0 ? 1 : 0, y: finalValue > 0 ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Invested:</span>
              <span className="font-medium text-gray-900">${totalInvested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Final Value:</span>
              <span className="font-medium text-green-600">${finalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit:</span>
              <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
