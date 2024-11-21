import { Tier, Expenses, OtherMetrics, FinancialMetrics, Currency, EXCHANGE_RATE } from '../types/calculator';

function formatValue(value: number, currency: Currency): string {
  const formattedValue = currency === 'SAR' ? value * EXCHANGE_RATE.USD_TO_SAR : value;
  return Math.round(formattedValue).toString();
}

function formatPercentage(value: number): string {
  return value.toFixed(1);
}

function formatRatio(value: number): string {
  return value.toFixed(1);
}

function escapeField(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSV(
  tiers: Tier[],
  expenses: Expenses,
  otherMetrics: OtherMetrics,
  metrics: FinancialMetrics,
  currency: Currency
): string {
  const rows: string[][] = [];

  // Header
  rows.push(['Section', 'Metric', 'Value', 'Unit']);

  // Subscription Tiers
  tiers.forEach((tier, index) => {
    const revenue = tier.pricePerMonth * tier.numSubscribers;
    rows.push(['Subscription Tiers', `${tier.name} - Price`, formatValue(tier.pricePerMonth, currency), currency]);
    rows.push(['Subscription Tiers', `${tier.name} - Subscribers`, tier.numSubscribers.toString(), 'count']);
    rows.push(['Subscription Tiers', `${tier.name} - Revenue`, formatValue(revenue, currency), currency]);
  });

  // Expenses
  rows.push(['Expenses', 'Fixed Costs', formatValue(expenses.totalFixedCostsPerMonth, currency), currency]);
  rows.push(['Expenses', 'Cost per User', formatValue(expenses.variableCostPerSubscriber, currency), currency]);
  rows.push(['Expenses', 'Marketing Costs', formatValue(expenses.totalSalesAndMarketingCostsPerMonth, currency), currency]);

  // Growth Metrics
  rows.push(['Growth', 'Monthly Churn Rate', formatPercentage(otherMetrics.churnRate), '%']);
  rows.push(['Growth', 'New Subscribers per Month', otherMetrics.newSubscribersPerMonth.toString(), 'count']);

  // Financial Planning
  rows.push(['Financial', 'Cash on Hand', formatValue(otherMetrics.totalCashOnHand, currency), currency]);
  rows.push(['Financial', 'Additional Funding', formatValue(otherMetrics.additionalFunding, currency), currency]);
  rows.push(['Financial', 'Funding Month', otherMetrics.fundingMonth.toString(), 'month']);
  rows.push(['Financial', 'Revenue Multiple', otherMetrics.revenueMultiple.toString(), 'x']);

  // Revenue Metrics
  rows.push(['Revenue', 'MRR', formatValue(metrics.mrr, currency), currency]);
  rows.push(['Revenue', 'ARR', formatValue(metrics.arr, currency), currency]);
  rows.push(['Revenue', 'Monthly Profit', formatValue(metrics.monthlyProfit, currency), currency]);
  rows.push(['Revenue', 'Profit Margin', formatPercentage(metrics.profitMargin), '%']);

  // Customer Economics
  rows.push(['Customer', 'ARPU', formatValue(metrics.arpu, currency), currency]);
  rows.push(['Customer', 'LTV', formatValue(metrics.ltv, currency), currency]);
  rows.push(['Customer', 'CAC', formatValue(metrics.cac, currency), currency]);
  rows.push(['Customer', 'LTV/CAC Ratio', formatRatio(metrics.ltv / metrics.cac), 'ratio']);

  // Business Health
  rows.push(['Health', 'Current Runway', metrics.runway.toString(), 'months']);
  rows.push(['Health', 'Adjusted Runway', metrics.adjustedRunway.toString(), 'months']);
  rows.push(['Health', 'Monthly Burn Rate', formatValue(metrics.burnRate, currency), currency]);

  // Valuation
  rows.push(['Valuation', 'Projected Value', formatValue(metrics.projectedValuation, currency), currency]);

  // Convert rows to CSV string
  return rows.map(row => row.map(escapeField).join(',')).join('\n');
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}