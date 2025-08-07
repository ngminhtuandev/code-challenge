import { useState, useEffect } from 'react';

/**
 * Represents a cryptocurrency with its identifying information.
 */
interface Currency {
  id: string; // The symbol of the currency (e.g., "BTC")
  name: string; // The full name of the currency (e.g., "Bitcoin")
  icon: string; // The URL to the currency's image icon
}

/**
 * A map of currency symbols to their current prices.
 */
interface TokenPrices {
  [key: string]: number;
}

/**
 * Custom hook to manage currency data, token prices, and debounced input.
 * @returns An object containing all necessary state and functions for the currency swap form.
 */
export const useCurrencyData = () => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [debouncedFromAmount, setDebouncedFromAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);

  // Function to fetch data from a public API
  const fetchTokenPrices = async (): Promise<{ prices: TokenPrices; currencies: Currency[] }> => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: any[] = await response.json();

    const prices: TokenPrices = {};
    const currencies: Currency[] = [];
    
    data.forEach(item => {
      const id = item.symbol.toUpperCase();
      prices[id] = item.current_price;
      currencies.push({ id, name: item.name, icon: item.image });
    });

    currencies.sort((a, b) => a.id.localeCompare(b.id));
    return { prices, currencies };
  };

  // Fetch token prices and available currencies on component mount
  useEffect(() => {
    const getPrices = async () => {
      try {
        const { prices, currencies } = await fetchTokenPrices();
        setTokenPrices(prices);
        setAvailableCurrencies(currencies);
        if (currencies.length >= 2) {
          setFromCurrency(currencies[0].id);
          setToCurrency(currencies[1].id);
        } else if (currencies.length === 1) {
          setFromCurrency(currencies[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPrices();
  }, []);

  // Debounce effect for the fromAmount input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromAmount(fromAmount);
    }, 500);

    return () => clearTimeout(timer);
  }, [fromAmount]);

  // Effect to calculate 'toAmount' whenever debouncedAmount or currencies change
  useEffect(() => {
    const parsedFromAmount = parseFloat(debouncedFromAmount);
    if (debouncedFromAmount === '' || isNaN(parsedFromAmount) || parsedFromAmount <= 0) {
      setToAmount('');
      return;
    }

    if (fromCurrency === toCurrency) {
      setToAmount(debouncedFromAmount);
      return;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      const fromPrice = tokenPrices[fromCurrency];
      const toPrice = tokenPrices[toCurrency];
      if (fromPrice !== undefined && toPrice !== undefined && parsedFromAmount > 0) {
        const calculatedToAmount = (parsedFromAmount * fromPrice) / toPrice;
        setToAmount(calculatedToAmount.toFixed(4));
      } else {
        setToAmount('');
      }
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedFromAmount, fromCurrency, toCurrency, tokenPrices]);

  // Return all the state and functions the component will need
  return {
    fromAmount, setFromAmount,
    fromCurrency, setFromCurrency,
    toAmount, setToAmount,
    toCurrency, setToCurrency,
    isLoading, setIsLoading,
    isCalculating, setIsCalculating,
    tokenPrices,
    availableCurrencies,
  };
};
