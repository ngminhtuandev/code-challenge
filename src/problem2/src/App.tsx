import './App.css'
import CurrencySwapForm from './components/CurrencySwapForm';
import { BalanceProvider } from './contexts/BalanceContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 grid place-items-center p-4 sm:p-6 lg:p-8 text-white">
      <BalanceProvider>
        <CurrencySwapForm />
      </BalanceProvider>
    </div>
  );
}

export default App;
