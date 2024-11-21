import React from 'react';
import { Currency, EXCHANGE_RATE } from '../types/calculator';
import { HelpCircle } from 'lucide-react';

interface Props {
  title: string;
  fullTitle: string;
  value: number | string;
  currency?: Currency;
  suffix?: string;
  tooltip: string;
  highlight?: boolean;
}

export default function MetricCard({ 
  title, 
  fullTitle,
  value, 
  currency, 
  suffix, 
  tooltip,
  highlight 
}: Props) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    let formattedValue = val;
    if (currency === 'SAR') {
      formattedValue *= EXCHANGE_RATE.USD_TO_SAR;
    }
    
    // Format currency values
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(formattedValue);
    }
    
    // Format non-currency numbers
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(formattedValue);
    
    return formatted + (suffix || '');
  };

  return (
    <div 
      className={`group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all ${
        highlight ? 'ring-2 ring-indigo-100' : ''
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <div className="relative">
              <HelpCircle size={14} className="text-gray-400" />
              <div className="tooltip">
                {tooltip}
                <div className="tooltip-arrow"></div>
              </div>
            </div>
          </div>
        </div>
        <p className={`text-xl font-semibold mb-1 ${
          highlight ? 'text-indigo-600' : 'text-gray-900'
        }`}>
          {formatValue(value)}
        </p>
        <p className="text-xs text-gray-500">{fullTitle}</p>
      </div>
    </div>
  );
}