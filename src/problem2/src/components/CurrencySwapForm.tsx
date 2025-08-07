import { useState, type JSX } from 'react';
import InputCard from './InputCard';
import SwapButton from './SwapButton';
import MessageDisplay from './MessageDisplay';
import BalanceDisplay from './BalanceDisplay';
import { useCurrencyData } from '../hooks/useCurrencyData';
import { useBalances } from '../contexts/BalanceContext';
import { MESSAGES } from '../constants/messages';

/**
 * Represents the state of a message to be displayed to the user.
 */
interface MessageState {
  type: '' | 'error' | 'success';
  text: string;
}

/**
 * The response object from a simulated swap operation.
 */
interface PerformSwapResponse {
  success: boolean;
  message: string;
}

// Moved the performSwap function outside as a separate, reusable function
const performSwap = async (from: string, to: string, amount: number): Promise<PerformSwapResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message: MESSAGES.success.swapSuccess(amount, from, to),
        });
      } else {
        reject(new Error(MESSAGES.errors.swapFailed));
      }
    }, 1500);
  });
};

function CurrencySwapForm(): JSX.Element {
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  const { balances, updateBalances } = useBalances();

  const {
    fromAmount, setFromAmount,
    fromCurrency, setFromCurrency,
    toAmount, setToAmount,
    toCurrency, setToCurrency,
    isLoading, setIsLoading,
    isCalculating,
    tokenPrices,
    availableCurrencies,
  } = useCurrencyData();

  const handleSwap = async (): Promise<void> => {
    const parsedFromAmount = parseFloat(fromAmount);
    if (parsedFromAmount <= 0 || fromAmount === '') {
      setMessage({ type: 'error', text: MESSAGES.errors.invalidAmount });
      return;
    }
    if (fromCurrency === toCurrency) {
      setMessage({ type: 'error', text: MESSAGES.errors.sameCurrency });
      return;
    }
    if (!tokenPrices[fromCurrency] || !tokenPrices[toCurrency]) {
      setMessage({ type: 'error', text: MESSAGES.errors.invalidCurrencies });
      return;
    }

    if (parsedFromAmount > (balances[fromCurrency] || 0)) {
      setMessage({ type: 'error', text: MESSAGES.errors.insufficientBalance });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await performSwap(fromCurrency, toCurrency, parsedFromAmount);
      const fromPrice = tokenPrices[fromCurrency];
      const toPrice = tokenPrices[toCurrency];
      const calculatedToAmount = (parsedFromAmount * fromPrice) / toPrice;

      updateBalances(fromCurrency, parsedFromAmount, toCurrency, calculatedToAmount);

      setMessage({ type: 'success', text: response.message });
      setFromAmount('');
      setToAmount('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || MESSAGES.errors.swapFailed });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReverseCurrencies = (): void => {
    const tempCurrency: string = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    if (fromAmount && toAmount) {
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };

  // Handler to set the max balance
  const handleSetMaxBalance = () => {
    const maxBalance = balances[fromCurrency];
    if (maxBalance !== undefined) {
      setFromAmount(maxBalance.toString());
    }
  };

  // Handler for 'from' currency change that also resets the input amount
  const handleFromCurrencyChange = (id: string): void => {
    setFromCurrency(id);
    setFromAmount(''); // Reset the input amount when currency changes
  };

  const isSwapDisabled = isLoading || isCalculating || parseFloat(fromAmount) <= 0 || fromCurrency === toCurrency || parseFloat(fromAmount) > (balances[fromCurrency] || 0);

  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl w-96 border border-gray-800 space-y-4">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
        {MESSAGES.swapFormTitle}
      </h2>
      <MessageDisplay message={message} />
      <div className="relative">
        <InputCard
          label={MESSAGES.payLabel}
          amount={fromAmount}
          currency={fromCurrency}
          currencies={availableCurrencies}
          onAmountChange={(e) => setFromAmount(e.target.value)}
          onCurrencyChange={handleFromCurrencyChange}
          isLoading={isLoading}
          isCalculating={isCalculating}
          readOnly={false}
        />
      </div>
      <BalanceDisplay currency={fromCurrency} onMaxClick={handleSetMaxBalance} />
      <SwapButton
        onClick={handleReverseCurrencies}
        isLoading={isLoading}
      />
      <InputCard
        label={MESSAGES.receiveLabel}
        amount={toAmount}
        currency={toCurrency}
        currencies={availableCurrencies}
        onAmountChange={() => { }}
        onCurrencyChange={(id) => setToCurrency(id)}
        isLoading={isLoading}
        isCalculating={isCalculating}
        readOnly={true}
      />
      <BalanceDisplay currency={toCurrency} />
      <button
        type="submit"
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed}`}
        onClick={handleSwap}
        disabled={isSwapDisabled}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          MESSAGES.swapButtonText
        )}
      </button>
    </div>
  );
}

export default CurrencySwapForm;
