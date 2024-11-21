import { Tier, Expenses, OtherMetrics, FinancialMetrics, Currency, EXCHANGE_RATE } from '../types/calculator';

function formatCurrency(value: number, currency: Currency): string {
  const formattedValue = currency === 'SAR' ? value * EXCHANGE_RATE.USD_TO_SAR : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(formattedValue);
}

function getRevenueInsights(metrics: FinancialMetrics, currency: Currency): string {
  const mrrText = `Monthly Recurring Revenue (MRR): ${formatCurrency(metrics.mrr, currency)}
${metrics.mrr >= metrics.totalMonthlyExpenses 
  ? '✓ Your MRR covers monthly expenses. Consider reinvesting excess in growth.'
  : '⚠ MRR is below monthly expenses. Focus on increasing revenue through customer acquisition or pricing optimization.'}

Annual Recurring Revenue (ARR): ${formatCurrency(metrics.arr, currency)}
${metrics.arr > 1000000 
  ? '✓ Strong ARR indicates significant market traction.'
  : '→ Continue building ARR through consistent growth in monthly revenue.'}

Monthly Profit: ${formatCurrency(metrics.monthlyProfit, currency)}
Profit Margin: ${metrics.profitMargin.toFixed(1)}%
${metrics.profitMargin > 20 
  ? '✓ Healthy profit margin above 20%. Maintain operational efficiency while investing in growth.'
  : metrics.profitMargin > 0 
    ? '→ Positive but modest margins. Look for opportunities to improve operational efficiency.'
    : '⚠ Negative margins indicate need for cost optimization or revenue growth.'}`;

  return mrrText;
}

function getCustomerInsights(metrics: FinancialMetrics, currency: Currency): string {
  const ltvCacRatio = metrics.ltv / metrics.cac;
  
  return `Customer Economics:

ARPU (Average Revenue Per User): ${formatCurrency(metrics.arpu, currency)}
${metrics.arpu < 100 
  ? '→ Consider opportunities for upselling or premium features to increase ARPU.'
  : '✓ Strong ARPU indicates effective pricing and value delivery.'}

LTV (Customer Lifetime Value): ${formatCurrency(metrics.ltv, currency)}
CAC (Customer Acquisition Cost): ${formatCurrency(metrics.cac, currency)}
LTV/CAC Ratio: ${ltvCacRatio.toFixed(1)}x
${ltvCacRatio >= 3 
  ? '✓ Healthy LTV/CAC ratio above 3x indicates efficient customer acquisition.'
  : '⚠ LTV/CAC ratio below 3x suggests need to improve unit economics through better retention or lower acquisition costs.'}

${metrics.paybackPeriod > 12 
  ? '⚠ Long payback period over 12 months. Consider ways to reduce CAC or increase monetization.'
  : '✓ Good payback period under 12 months allows for faster reinvestment in growth.'}`;
}

function getBusinessHealthInsights(metrics: FinancialMetrics, currency: Currency): string {
  const runwayText = typeof metrics.runway === 'number' 
    ? `${metrics.runway} months`
    : 'Infinite (Cash flow positive)';
    
  const adjustedRunwayText = typeof metrics.adjustedRunway === 'number'
    ? `${metrics.adjustedRunway} months`
    : 'Infinite (Cash flow positive)';

  return `Business Health:

Current Runway: ${runwayText}
Adjusted Runway: ${adjustedRunwayText}
Monthly Burn Rate: ${formatCurrency(metrics.burnRate, currency)}

${typeof metrics.runway === 'number' && metrics.runway < 6 
  ? '⚠ Limited runway requires immediate attention to extend cash reserves.'
  : typeof metrics.runway === 'number' && metrics.runway < 12
    ? '→ Moderate runway. Plan for future fundraising or path to profitability.'
    : '✓ Strong runway position provides stability for executing growth plans.'}

${metrics.burnRate > metrics.mrr * 0.5 
  ? '⚠ High burn rate relative to MRR. Consider optimizing expenses.'
  : '✓ Burn rate appears sustainable relative to revenue.'}`;
}

function getValuationInsights(metrics: FinancialMetrics, otherMetrics: OtherMetrics, currency: Currency): string {
  return `Valuation Analysis:

Projected Valuation: ${formatCurrency(metrics.projectedValuation, currency)}
Based on ${otherMetrics.revenueMultiple}x ARR multiple

${otherMetrics.revenueMultiple < 5 
  ? 'Conservative valuation multiple typical for early-stage companies.'
  : otherMetrics.revenueMultiple < 10
    ? 'Moderate valuation multiple aligned with growth-stage companies.'
    : 'Premium valuation multiple reflecting high-growth expectations.'}

Key Value Drivers:
${metrics.profitMargin > 20 ? '✓ Strong profit margins' : '→ Room for margin improvement'}
${metrics.ltv / metrics.cac > 3 ? '✓ Efficient unit economics' : '→ Opportunity to optimize unit economics'}
${typeof metrics.runway === 'string' ? '✓ Cash flow positive' : '→ Path to profitability important for valuation'}`;
}

function getStrategicRecommendations(metrics: FinancialMetrics): string {
  const recommendations: string[] = [];

  if (metrics.profitMargin < 0) {
    recommendations.push('• Prioritize path to profitability through revenue growth and cost optimization');
  }
  if (metrics.arpu < 100) {
    recommendations.push('• Explore opportunities for premium features or upselling to increase ARPU');
  }
  if (metrics.ltv / metrics.cac < 3) {
    recommendations.push('• Improve unit economics by reducing CAC or increasing customer lifetime value');
  }
  if (metrics.paybackPeriod > 12) {
    recommendations.push('• Focus on reducing customer payback period through more efficient acquisition');
  }
  if (typeof metrics.runway === 'number' && metrics.runway < 12) {
    recommendations.push('• Develop clear plan for extending runway through fundraising or reaching profitability');
  }
  if (metrics.burnRate > metrics.mrr * 0.5) {
    recommendations.push('• Review cost structure to optimize burn rate while maintaining growth');
  }

  return `Strategic Recommendations:

${recommendations.join('\n')}

Key Focus Areas:
1. ${metrics.profitMargin < 0 ? 'Achieving profitability' : 'Scaling revenue'}
2. ${metrics.ltv / metrics.cac < 3 ? 'Improving unit economics' : 'Maintaining efficient growth'}
3. ${typeof metrics.runway === 'number' ? 'Extending runway' : 'Reinvesting in growth'}`;
}

export function generateReport(
  tiers: Tier[],
  expenses: Expenses,
  otherMetrics: OtherMetrics,
  metrics: FinancialMetrics,
  currency: Currency
): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `NARRA SaaS Financial Analysis Report
Generated on ${timestamp}

Executive Summary:
This report analyzes key financial metrics and provides strategic insights for your SaaS business.

${getRevenueInsights(metrics, currency)}

${getCustomerInsights(metrics, currency)}

${getBusinessHealthInsights(metrics, currency)}

${getValuationInsights(metrics, otherMetrics, currency)}

${getStrategicRecommendations(metrics)}

Note: This report is generated based on current metrics and should be reviewed regularly as business conditions change.`;
}

export function downloadReport(reportContent: string, filename: string) {
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
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