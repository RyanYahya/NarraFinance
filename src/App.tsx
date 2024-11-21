import React, { useState } from 'react';
import { Download, FileText, RotateCcw } from 'lucide-react';
import CurrencyToggle from './components/CurrencyToggle';
import TierManager from './components/TierManager';
import ExpensesInput from './components/ExpensesInput';
import OtherMetricsInput from './components/OtherMetricsInput';
import MetricsDisplay from './components/MetricsDisplay';
import { generateCSV, downloadCSV } from './utils/csvExport';
import { generateReport, downloadReport } from './utils/reportExport';
import { calculateMetrics } from './utils/calculations';
import type { Tier, Expenses, OtherMetrics, Currency } from './types/calculator';

function App() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [tiers, setTiers] = useState<Tier[]>([
    { id: '1', name: 'Basic', pricePerMonth: 10, numSubscribers: 100 },
    { id: '2', name: 'Pro', pricePerMonth: 30, numSubscribers: 50 },
  ]);

  const [expenses, setExpenses] = useState<Expenses>({
    totalFixedCostsPerMonth: 5000,
    variableCostPerSubscriber: 1,
    totalSalesAndMarketingCostsPerMonth: 2000,
  });

  const [otherMetrics, setOtherMetrics] = useState<OtherMetrics>({
    churnRate: 5,
    newSubscribersPerMonth: 20,
    totalCashOnHand: 100000,
    additionalFunding: 500000,
    fundingMonth: 6,
    revenueMultiple: 10,
  });

  const handleExportCSV = () => {
    const metrics = calculateMetrics(tiers, expenses, otherMetrics);
    const csvContent = generateCSV(tiers, expenses, otherMetrics, metrics, currency);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `narra-saas-scenario-${timestamp}.csv`);
  };

  const handleExportReport = () => {
    const metrics = calculateMetrics(tiers, expenses, otherMetrics);
    const reportContent = generateReport(tiers, expenses, otherMetrics, metrics, currency);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadReport(reportContent, `narra-saas-report-${timestamp}.txt`);
  };

  const handleReset = () => {
    setTiers([
      { id: '1', name: 'Basic', pricePerMonth: 0, numSubscribers: 0 },
      { id: '2', name: 'Pro', pricePerMonth: 0, numSubscribers: 0 },
    ]);
    setExpenses({
      totalFixedCostsPerMonth: 0,
      variableCostPerSubscriber: 0,
      totalSalesAndMarketingCostsPerMonth: 0,
    });
    setOtherMetrics({
      churnRate: 0,
      newSubscribersPerMonth: 0,
      totalCashOnHand: 0,
      additionalFunding: 0,
      fundingMonth: 1,
      revenueMultiple: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.ibb.co/PYQ8hrH/Logo-01.png" 
              alt="NARRA" 
              className="h-6 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-900">Financial Scenario Calculator</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors"
              title="Reset all fields to zero"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FileText size={16} />
              Export Report
            </button>
            <CurrencyToggle currency={currency} onToggle={setCurrency} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Input Fields */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <TierManager tiers={tiers} currency={currency} onUpdate={setTiers} />
            <div className="grid grid-cols-2 gap-4">
              <ExpensesInput expenses={expenses} currency={currency} onChange={setExpenses} />
              <OtherMetricsInput metrics={otherMetrics} currency={currency} onChange={setOtherMetrics} />
            </div>
          </div>

          {/* Right Column - Metrics Display */}
          <div className="col-span-12 lg:col-span-7">
            <MetricsDisplay 
              tiers={tiers}
              expenses={expenses}
              otherMetrics={otherMetrics}
              currency={currency}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} <a href="https://narra-sa.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 transition-colors">Narra</a>™ - 
            <span className="ml-1">Free for entrepreneurs to better understand their startup's financial potential and make informed decisions.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;