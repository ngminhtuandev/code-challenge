import { createContext, useState, useContext, type ReactNode, useCallback } from 'react';

interface BalanceContextType {
  balances: { [key: string]: number };
  updateBalances: (fromCurrency: string, fromAmount: number, toCurrency: string, toAmount: number) => void;
}

const MOCK_INITIAL_BALANCES = {
  ETH: 10,
  BTC: 1,
  USDT: 10000,
  BNB: 50,
  SOL: 200,
  AAVE: 1993
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<{ [key: string]: number }>(MOCK_INITIAL_BALANCES);

  const updateBalances = useCallback((fromCurrency: string, fromAmount: number, toCurrency: string, toAmount: number) => {
    setBalances(prevBalances => {
      const newBalances = { ...prevBalances };

      newBalances[fromCurrency] = (newBalances[fromCurrency] || 0) - fromAmount;
      newBalances[toCurrency] = (newBalances[toCurrency] || 0) + toAmount;

      return newBalances;
    });
  }, []);

  return (
    <BalanceContext.Provider value={{ balances, updateBalances }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalances = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalances must be used within a BalanceProvider');
  }
  return context;
};
