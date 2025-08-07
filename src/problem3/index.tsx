interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: string; // ✅ Added `blockchain` for type safety and functional completeness.
}

interface Props extends BoxProps {

}

// ✅ Define priorities as a constant object for readability and maintainability.
const BLOCKCHAIN_PRIORITIES = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
	Default: -99,
} as const;

// ✅ The function is now type-safe and uses a simple, readable object lookup.
const getPriority = (blockchain: string): number => {
	return BLOCKCHAIN_PRIORITIES[blockchain as keyof typeof BLOCKCHAIN_PRIORITIES] ?? BLOCKCHAIN_PRIORITIES.Default;
};

const WalletPage: React.FC<Props> = (props: Props) => {
	const { children, ...rest } = props;
	const balances = useWalletBalances();
	const prices = usePrices();

	// ✅ REFACTORING: The entire data processing pipeline is now integrated into a single `useMemo` block that generates the final `rows`.
	const rows = useMemo(() => {
		return balances
			.filter((balance: WalletBalance) => {
				const priority = getPriority(balance.blockchain);
				// ✅ Corrected filter logic: Keep the balance if the priority is valid AND the amount is positive.
				return priority > -99 && balance.amount > 0;
			})
			.sort((lhs: WalletBalance, rhs: WalletBalance) => {
				const leftPriority = getPriority(lhs.blockchain);
				const rightPriority = getPriority(rhs.blockchain);
				// ✅ Corrected sort logic: This concise syntax handles all cases, including when priorities are equal.
				return rightPriority - leftPriority;
			})
			.map((balance: WalletBalance) => {
				const usdValue = prices[balance.currency] * balance.amount;
				const formattedAmount = balance.amount.toFixed(2); // ✅ `toFixed()` was changed to `toFixed(2)` for consistent formatting.

				return (
					<WalletRow
						key={`${balance.blockchain}-${balance.currency}`} // ✅ A stable, unique key is now used.
						amount={balance.amount}
						usdValue={usdValue}
						formattedAmount={formattedAmount}
					/>
				);
			});
	}, [balances, prices]);

	return (
		<div {...rest}>
			{rows}
		</div>
	)
}
