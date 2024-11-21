import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Tier, Currency } from '../types/calculator';
import InputField from './InputField';

interface Props {
  tiers: Tier[];
  currency: Currency;
  onUpdate: (tiers: Tier[]) => void;
}

export default function TierManager({ tiers, currency, onUpdate }: Props) {
  const handleAddTier = () => {
    onUpdate([
      ...tiers,
      {
        id: crypto.randomUUID(),
        name: `Tier ${tiers.length + 1}`,
        pricePerMonth: 0,
        numSubscribers: 0,
      },
    ]);
  };

  const handleUpdateTier = (index: number, field: keyof Tier, value: string | number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onUpdate(newTiers);
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    onUpdate(newTiers);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900">Subscription Tiers</h2>
        <button
          onClick={handleAddTier}
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm"
        >
          <PlusCircle size={16} />
          <span>Add Tier</span>
        </button>
      </div>
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <div
            key={tier.id}
            className="border rounded-md p-4 space-y-3 hover:border-indigo-200 transition-colors"
          >
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={tier.name}
                onChange={(e) => handleUpdateTier(index, 'name', e.target.value)}
                className="text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none px-1 -ml-1"
                placeholder="Tier Name"
              />
              <button
                onClick={() => handleRemoveTier(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                title="Remove tier"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Price per Month"
                value={tier.pricePerMonth}
                onChange={(value) => handleUpdateTier(index, 'pricePerMonth', value)}
                currency={currency}
                step={0.01}
              />
              <InputField
                label="Number of Subscribers"
                value={tier.numSubscribers}
                onChange={(value) => handleUpdateTier(index, 'numSubscribers', value)}
                step={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}