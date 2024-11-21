import React from 'react';
import { DollarSign, Coins } from 'lucide-react';
import { Currency } from '../types/calculator';

interface Props {
  currency: Currency;
  onToggle: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onToggle }: Props) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
      <button
        onClick={() => onToggle('USD')}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
          currency === 'USD'
            ? 'bg-indigo-100 text-indigo-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <DollarSign size={16} />
        <span>USD</span>
      </button>
      <button
        onClick={() => onToggle('SAR')}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
          currency === 'SAR'
            ? 'bg-indigo-100 text-indigo-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <Coins size={16} />
        <span>SAR</span>
      </button>
    </div>
  );
}