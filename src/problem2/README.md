## Currency Swap App
This is a single-page React application that simulates a cryptocurrency swap interface. It is built using modern React with functional components and hooks, and styled with Tailwind CSS.

### How to Run the App
This application is designed to run in a standard React development environment, such as one created with Vite.

#### Prerequisites: Ensure you have Node.js and a package manager (npm or Yarn) installed on your system.

`cd src/problem2`
then

`npm i` or `yarn`

then you can start the development server with `npm run dev`

Finally, open your browser and navigate to the address provided in the terminal (http://localhost:5173).

## App Features

### 1. Dynamic Currency Data:
The app fetches a list of popular cryptocurrencies and their current prices from the CoinGecko API on startup.

### 2. Real-time Conversion:
As you type an amount, the app uses a debounced effect to calculate the converted amount in the "You receive" field, ensuring a smooth and responsive user experience without excessive API calls.

### 3. User Balance Management:
A `BalanceContext` is used to manage a mock user balance, which is displayed for the selected "You pay" currency.

### 4. Max Balance Functionality:
A "Max" button is provided to quickly and easily input the entire available balance of the selected currency.

### 5. Simulated Swap:
The "Swap" button triggers a simulated asynchronous transaction, providing a success message or a failure message based on a random chance.

### 6. UI State Indicators:
The user interface provides clear feedback through loading spinners and disabled buttons to indicate when a calculation or transaction is in progress, preventing user error and improving clarity.

### 7. Currency Reversal:
A dedicated swap button allows the user to quickly reverse the "You pay" and "You receive" currencies.

## Component Breakdown

### 1. App.tsx:
The main entry point of the application. It sets up the `BalanceProvider` context and renders the main `CurrencySwapForm` component.

### 2. CurrencySwapForm.tsx:
The primary component that orchestrates the entire swap form. It manages the main form logic, handles user interactions, and renders all the sub-components.

### 3. InputCard.tsx:
A reusable component for displaying a currency input field and a dropdown for selecting the currency. It shows the input amount and the selected token.

### 4. SwapButton.tsx:
A simple component that contains the button to reverse the "pay" and "receive" currencies. It includes a subtle animation and is styled to stand out.

### 5. MessageDisplay.tsx:
A component to display success or error messages to the user. It provides visual feedback for transactions and validation errors.

### 6. BalanceDisplay.tsx:
A component that shows the user's available balance for the selected currency. It integrates with the `BalanceContext` to display real-time balance information.

### 7. useCurrencyData.ts:
A custom hook responsible for fetching currency data from an external API, managing state related to currency amounts and selections, and handling the debounced calculation logic.

### 8. BalanceContext.tsx:
A React Context that manages the global state for the user's balances. It provides the balance data and functions to update the balances to any component in the application.

### 9. constants/messages.ts:
A utility file that centralizes all application-wide text strings and messages, such as button labels, placeholder text, and error messages.
