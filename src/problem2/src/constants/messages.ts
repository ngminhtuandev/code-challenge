export const MESSAGES = {
  swapFormTitle: 'Currency Swap',
  payLabel: 'You pay',
  receiveLabel: 'You receive',
  swapButtonText: 'Swap',
  calculatingStatus: 'Calculating...',
  selectPlaceholder: 'Select',
  balanceLabel: 'Balance',
  errors: {
    invalidAmount: 'Please enter a valid amount to swap.',
    sameCurrency: 'Cannot swap to the same currency.',
    invalidCurrencies: 'Invalid currencies selected.',
    swapFailed: 'An unknown error occurred.',
    insufficientBalance: 'Insufficient balance to perform the swap.'
  },
  success: {
    swapSuccess: (amount: number, from: string, to: string) =>
      `Successfully swapped ${amount} ${from} for ${(amount * 0.99).toFixed(4)} ${to}.`
  }
};
