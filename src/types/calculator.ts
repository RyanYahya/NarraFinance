export interface Tier {
  id: string;
  name: string;
  pricePerMonth: number;
  numSubscribers: number;
}

export interface FinancialMetrics {
  mrr: number;
  arr: number;
  totalMonthlyRevenue: number;
  totalMonthlyExpenses: number;
  monthlyProfit: number;
  profitMargin: number;
  arpu: number;
  ltv: number;
  cac: number;
  paybackPeriod: number;
  burnRate: number;
  runway: number | 'Infinite';
  projectedValuation: number;
  adjustedRunway: number | 'Infinite';
}

export interface Expenses {
  totalFixedCostsPerMonth: number;
  variableCostPerSubscriber: number;
  totalSalesAndMarketingCostsPerMonth: number;
}

export interface OtherMetrics {
  churnRate: number;
  newSubscribersPerMonth: number;
  totalCashOnHand: number;
  additionalFunding: number;
  fundingMonth: number;
  revenueMultiple: number;
}

export type Currency = 'USD' | 'SAR';

export const EXCHANGE_RATE = {
  USD_TO_SAR: 3.75,
  SAR_TO_USD: 1 / 3.75,
};