import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Users, Clock, Briefcase } from 'lucide-react';
import MetricCard from './MetricCard';
import { calculateMetrics } from '../utils/calculations';
import type { Tier, Expenses, OtherMetrics, Currency } from '../types/calculator';

interface Props {
  tiers: Tier[];
  expenses: Expenses;
  otherMetrics: OtherMetrics;
  currency: Currency;
}

export default function MetricsDisplay({ tiers, expenses, otherMetrics, currency }: Props) {
  const metrics = useMemo(
    () => calculateMetrics(tiers, expenses, otherMetrics),
    [tiers, expenses, otherMetrics]
  );

  const getInsightColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">Revenue Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            title="MRR"
            fullTitle="Monthly Recurring Revenue"
            value={metrics.mrr}
            currency={currency}
            tooltip="Total predictable revenue generated per month from all active subscriptions"
            highlight
          />
          <MetricCard
            title="ARR"
            fullTitle="Annual Recurring Revenue"
            value={metrics.arr}
            currency={currency}
            tooltip="Annualized MRR (Monthly Recurring Revenue × 12), useful for long-term revenue forecasting"
            highlight
          />
          <MetricCard
            title="Monthly Profit"
            fullTitle="Net Monthly Income"
            value={metrics.monthlyProfit}
            currency={currency}
            tooltip="Total revenue minus all expenses (fixed costs, variable costs, and marketing costs)"
            highlight
          />
        </div>
        <p className={`text-sm ${getInsightColor(metrics.profitMargin, 20)}`}>
          Your profit margin is {Math.round(metrics.profitMargin)}% 
          {metrics.profitMargin < 20 ? ' - Consider optimizing costs or increasing prices' : ' - Healthy profit margin!'}
        </p>
      </div>

      {/* Customer Economics */}
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">Customer Economics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            title="ARPU"
            fullTitle="Average Revenue Per User"
            value={metrics.arpu}
            currency={currency}
            tooltip="Average monthly revenue generated per subscriber (Total Revenue ÷ Total Subscribers)"
          />
          <MetricCard
            title="LTV"
            fullTitle="Customer Lifetime Value"
            value={metrics.ltv}
            currency={currency}
            tooltip="Predicted total revenue from a single customer over their entire relationship with your business"
          />
          <MetricCard
            title="CAC"
            fullTitle="Customer Acquisition Cost"
            value={metrics.cac}
            currency={currency}
            tooltip="Average cost to acquire a new customer (Total Marketing Costs ÷ New Subscribers)"
          />
        </div>
        <p className={`text-sm ${getInsightColor(metrics.ltv / metrics.cac, 3)}`}>
          LTV/CAC ratio is {(metrics.ltv / metrics.cac).toFixed(1)}x
          {metrics.ltv / metrics.cac < 3 ? ' - Aim for 3x or higher for sustainable growth' : ' - Great unit economics!'}
        </p>
      </div>

      {/* Business Health */}
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">Business Health</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            title="Current Runway"
            fullTitle="Months Without Additional Funding"
            value={metrics.runway}
            suffix={typeof metrics.runway === 'number' ? ' months' : ''}
            tooltip="Time until cash reserves are depleted at current burn rate without additional funding"
          />
          <MetricCard
            title="Adjusted Runway"
            fullTitle="Months With Additional Funding"
            value={metrics.adjustedRunway}
            suffix={typeof metrics.adjustedRunway === 'number' ? ' months' : ''}
            tooltip="Extended runway after receiving planned additional funding"
            highlight
          />
          <MetricCard
            title="Burn Rate"
            fullTitle="Monthly Cash Burn"
            value={metrics.burnRate}
            currency={currency}
            tooltip="Rate at which the company is spending its cash reserves"
          />
        </div>
        <p className={`text-sm ${getInsightColor(
          typeof metrics.adjustedRunway === 'number' ? metrics.adjustedRunway : 100,
          12
        )}`}>
          {typeof metrics.adjustedRunway === 'number'
            ? `With funding, you'll have ${Math.round(metrics.adjustedRunway)} months of runway${
                metrics.adjustedRunway < 12 ? ' - Plan your next fundraising round' : ''
              }`
            : 'You are cash flow positive! Focus on reinvesting for growth.'}
        </p>
      </div>

      {/* Valuation */}
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">Valuation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            title="Projected Valuation"
            fullTitle={`Based on ${otherMetrics.revenueMultiple}x ARR Multiple`}
            value={metrics.projectedValuation}
            currency={currency}
            tooltip="Estimated company value based on your ARR and the selected revenue multiple"
            highlight
          />
        </div>
        <p className="text-sm text-gray-600">
          Based on {otherMetrics.revenueMultiple}x ARR multiple, typical for {
            otherMetrics.revenueMultiple < 5 ? 'early-stage' :
            otherMetrics.revenueMultiple < 10 ? 'growth-stage' : 'high-growth'
          } SaaS companies
        </p>
      </div>
    </div>
  );
}