import React from 'react';
import { Currency, EXCHANGE_RATE } from '../types/calculator';
import { HelpCircle } from 'lucide-react';

interface Preset {
  label: string;
  value: number;
}

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: Currency;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  type?: 'number' | 'currency' | 'slider';
  presets?: Preset[];
}

export default function InputField({
  label,
  value,
  onChange,
  currency,
  suffix,
  min = 0,
  max,
  step = 1,
  tooltip,
  type = 'number',
  presets
}: Props) {
  const displayValue = currency === 'SAR' && value 
    ? Math.round(value * EXCHANGE_RATE.USD_TO_SAR)
    : Math.round(value * 100) / 100; // Round to 2 decimal places

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value);
    if (isNaN(newValue)) return;
    
    const finalValue = currency === 'SAR'
      ? Math.round(newValue * EXCHANGE_RATE.SAR_TO_USD * 100) / 100
      : Math.round(newValue * 100) / 100;
      
    onChange(finalValue);
  };

  return (
    <div className="relative space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="block text-xs font-medium text-gray-600">
            {label}
          </label>
          {tooltip && (
            <div className="group relative">
              <HelpCircle size={14} className="text-gray-400" />
              <div className="tooltip">
                {tooltip}
                <div className="tooltip-arrow" />
              </div>
            </div>
          )}
        </div>
        {type !== 'slider' && (
          <span className="text-xs text-gray-400">
            {currency ? (currency === 'USD' ? '$' : 'SAR') : ''}{displayValue}{suffix}
          </span>
        )}
      </div>

      <div className="relative">
        {type === 'slider' ? (
          <div className="space-y-2">
            <input
              type="range"
              value={displayValue}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              min={min}
              max={max}
              step={step}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{min}{suffix}</span>
              <span>{displayValue}{suffix}</span>
              <span>{max}{suffix}</span>
            </div>
            {presets && (
              <div className="flex gap-2 mt-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onChange(preset.value)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      value === preset.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {currency && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {currency === 'USD' ? '$' : 'SAR'}
                </span>
              </div>
            )}
            <input
              type="number"
              value={displayValue}
              onChange={handleChange}
              className={`block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6
                placeholder:text-gray-400 hover:ring-gray-400 transition-colors
                ${currency ? 'pl-12' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
              min={min}
              max={max}
              step={step}
            />
            {suffix && !currency && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{suffix}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}