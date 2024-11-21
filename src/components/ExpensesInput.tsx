import React from 'react';
import { Currency, Expenses } from '../types/calculator';
import InputField from './InputField';

interface Props {
  expenses: Expenses;
  currency: Currency;
  onChange: (expenses: Expenses) => void;
}

export default function ExpensesInput({ expenses, currency, onChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Expenses</h2>
      <div className="space-y-3">
        <InputField
          label="Fixed Costs per Month"
          value={expenses.totalFixedCostsPerMonth}
          onChange={(value) => onChange({ ...expenses, totalFixedCostsPerMonth: value })}
          currency={currency}
        />
        <InputField
          label="Cost per User per Month"
          value={expenses.variableCostPerSubscriber}
          onChange={(value) => onChange({ ...expenses, variableCostPerSubscriber: value })}
          currency={currency}
          step={0.01}
        />
        <InputField
          label="Marketing Costs per Month"
          value={expenses.totalSalesAndMarketingCostsPerMonth}
          onChange={(value) => onChange({ ...expenses, totalSalesAndMarketingCostsPerMonth: value })}
          currency={currency}
        />
      </div>
    </div>
  );
}