import { Tier, Expenses, OtherMetrics, FinancialMetrics } from '../types/calculator';

function calculateAdjustedRunway(
  monthlyProfit: number,
  totalCashOnHand: number,
  additionalFunding: number,
  fundingMonth: number
): number | 'Infinite' {
  if (monthlyProfit >= 0) return 'Infinite';

  let remainingCash = totalCashOnHand;
  let month = 0;
  const burnRate = -monthlyProfit;

  while (remainingCash > 0) {
    month++;
    if (month === fundingMonth) {
      remainingCash += additionalFunding;
    }
    remainingCash -= burnRate;
  }

  return Math.max(0, month - 1);
}

export function calculateMetrics(
  tiers: Tier[],
  expenses: Expenses,
  otherMetrics: OtherMetrics
): FinancialMetrics {
  // Calculate total subscribers and MRR
  const totalSubscribers = tiers.reduce((sum, tier) => sum + tier.numSubscribers, 0);
  const mrr = tiers.reduce(
    (sum, tier) => sum + (tier.pricePerMonth * tier.numSubscribers),
    0
  );

  // Calculate ARR
  const arr = mrr * 12;

  // Calculate total monthly expenses
  const totalVariableCosts = expenses.variableCostPerSubscriber * totalSubscribers;
  const totalMonthlyExpenses =
    expenses.totalFixedCostsPerMonth +
    totalVariableCosts +
    expenses.totalSalesAndMarketingCostsPerMonth;

  // Calculate profit metrics
  const monthlyProfit = mrr - totalMonthlyExpenses;
  const profitMargin = mrr > 0 ? (monthlyProfit / mrr) * 100 : 0;

  // Calculate per-user metrics
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  const grossMarginPerUser = arpu - expenses.variableCostPerSubscriber;

  // Calculate LTV
  const churnRateDecimal = otherMetrics.churnRate / 100;
  const ltv = churnRateDecimal > 0 ? grossMarginPerUser / churnRateDecimal : 0;

  // Calculate CAC
  const cac = otherMetrics.newSubscribersPerMonth > 0
    ? expenses.totalSalesAndMarketingCostsPerMonth / otherMetrics.newSubscribersPerMonth
    : 0;

  // Calculate burn rate and runway
  const burnRate = monthlyProfit < 0 ? -monthlyProfit : 0;
  const runway = burnRate > 0 
    ? Math.floor(otherMetrics.totalCashOnHand / burnRate)
    : 'Infinite';

  // Calculate adjusted runway with funding
  const adjustedRunway = calculateAdjustedRunway(
    monthlyProfit,
    otherMetrics.totalCashOnHand,
    otherMetrics.additionalFunding,
    otherMetrics.fundingMonth
  );

  // Calculate projected valuation based on ARR multiple
  const projectedValuation = arr * otherMetrics.revenueMultiple;

  // Return all metrics rounded to integers to avoid floating-point issues
  return {
    mrr: Math.round(mrr),
    arr: Math.round(arr),
    totalMonthlyRevenue: Math.round(mrr),
    totalMonthlyExpenses: Math.round(totalMonthlyExpenses),
    monthlyProfit: Math.round(monthlyProfit),
    profitMargin: Math.round(profitMargin * 10) / 10, // Round to 1 decimal place
    arpu: Math.round(arpu),
    ltv: Math.round(ltv),
    cac: Math.round(cac),
    paybackPeriod: Math.round(cac / grossMarginPerUser * 10) / 10, // Round to 1 decimal place
    burnRate: Math.round(burnRate),
    runway,
    adjustedRunway,
    projectedValuation: Math.round(projectedValuation),
  };
}