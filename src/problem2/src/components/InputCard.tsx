import React, { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { MESSAGES } from '../constants/messages';

// Interfaces for the component's props
interface Currency {
  id: string;
  name: string;
  icon: string;
}

interface InputCardProps {
  label: string;
  amount: string;
  currency: string;
  currencies: Currency[];
  onAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCurrencyChange: (currencyId: string) => void;
  isLoading: boolean;
  isCalculating: boolean;
  readOnly: boolean;
}

const InputCard: React.FC<InputCardProps> = ({
  label,
  amount,
  currency,
  currencies,
  onAmountChange,
  onCurrencyChange,
  isLoading,
  isCalculating,
  readOnly,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery(''); // Reset search query when closing the dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Filter currencies based on the search query
  const filteredCurrencies = currencies.filter(c =>
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCurrency = currencies.find(c => c.id === currency);

  const handleCurrencySelect = (currencyId: string) => {
    onCurrencyChange(currencyId);
    setIsDropdownOpen(false);
    setSearchQuery(''); // Reset search query when a currency is selected
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
        <input
          type="number"
          className={`block w-full py-3 pl-4 pr-32 bg-gray-100 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg border border-gray-300
          ${readOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-gray-900'}`}
          placeholder="0.00"
          value={isCalculating && readOnly ? MESSAGES.calculatingStatus : amount}
          onChange={onAmountChange}
          readOnly={readOnly}
          disabled={isLoading || isCalculating}
        />
        <div className="absolute inset-y-0 right-2 flex items-center" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-150"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading}
          >
            {selectedCurrency && (
              <img src={selectedCurrency.icon} alt={selectedCurrency.name} className="w-6 h-6 rounded-full" />
            )}
            <span className="font-semibold">{selectedCurrency?.id || MESSAGES.selectPlaceholder}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-300 border border-gray-400 rounded-xl shadow-lg z-10">
              <input
                type="text"
                placeholder="Search currency..."
                className="block w-full p-2 bg-gray-200 text-gray-900 rounded-t-xl border-b border-gray-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-400 cursor-pointer transition-colors duration-150"
                      onClick={() => handleCurrencySelect(c.id)}
                    >
                      <img src={c.icon} alt={c.name} className="w-7 h-7 rounded-full" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">{c.id}</span>
                        <span className="text-xs text-gray-600">{c.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-600">No results found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputCard;
