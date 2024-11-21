import React from 'react';
import { Currency, OtherMetrics } from '../types/calculator';
import InputField from './InputField';

interface Props {
  metrics: OtherMetrics;
  currency: Currency;
  onChange: (metrics: OtherMetrics) => void;
}

export default function OtherMetricsInput({ metrics, currency, onChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Other Metrics</h2>
      
      {/* Growth Metrics */}
      <div className="space-y-3 mb-4">
        <InputField
          label="Monthly Churn Rate"
          value={metrics.churnRate}
          onChange={(value) => onChange({ ...metrics, churnRate: value })}
          suffix="%"
          min={0}
          max={100}
          step={0.1}
          tooltip="Percentage of customers that cancel their subscription each month"
          type="slider"
        />
        <InputField
          label="New Subscribers/Month"
          value={metrics.newSubscribersPerMonth}
          onChange={(value) => onChange({ ...metrics, newSubscribersPerMonth: value })}
          step={1}
          tooltip="Average number of new customers acquired each month"
          type="number"
        />
      </div>

      {/* Financial Planning */}
      <div className="space-y-3 mb-4">
        <InputField
          label="Cash on Hand"
          value={metrics.totalCashOnHand}
          onChange={(value) => onChange({ ...metrics, totalCashOnHand: value })}
          currency={currency}
          tooltip="Current available cash reserves"
          type="currency"
        />
        <InputField
          label="Additional Funding"
          value={metrics.additionalFunding}
          onChange={(value) => onChange({ ...metrics, additionalFunding: value })}
          currency={currency}
          tooltip="Amount of additional funding you plan to raise"
          type="currency"
        />
      </div>

      {/* Valuation Metrics */}
      <div className="space-y-3">
        <InputField
          label="Funding Month"
          value={metrics.fundingMonth}
          onChange={(value) => onChange({ ...metrics, fundingMonth: value })}
          min={1}
          max={24}
          step={1}
          tooltip="Number of months until you receive the additional funding"
          type="slider"
        />
        <InputField
          label="Revenue Multiple"
          value={metrics.revenueMultiple}
          onChange={(value) => onChange({ ...metrics, revenueMultiple: value })}
          min={0}
          max={20}
          step={0.5}
          tooltip="Multiple of ARR used to estimate company valuation (typically 5-15x for SaaS)"
          type="slider"
          presets={[
            { label: 'Early Stage', value: 5 },
            { label: 'Growth', value: 10 },
            { label: 'High Growth', value: 15 }
          ]}
        />
      </div>
    </div>
  );
}