import React from 'react';
import { useBalances } from '../contexts/BalanceContext';
import { MESSAGES } from '../constants/messages';

interface BalanceDisplayProps {
  currency: string;
  onMaxClick?: () => void;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ currency, onMaxClick }) => {
  const { balances } = useBalances();
  const balance = balances[currency];

  if (balance === undefined) {
    return null;
  }

  return (
    <div className="text-right text-gray-200 text-sm flex items-center justify-end space-x-2 mt-1">
      <span>
        {MESSAGES.balanceLabel}: <span className="font-semibold text-white">{balance.toFixed(4)}</span>
      </span>
      {onMaxClick && balance > 0 && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onMaxClick();
          }}
          className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 focus:outline-none cursor-pointer"
        >
          Max
        </a>
      )}
    </div>
  );
};

export default BalanceDisplay;
