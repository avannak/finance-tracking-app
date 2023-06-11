"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type ContextTypes = {
  showIncomeModal: boolean;
  setShowIncomeModal: Dispatch<SetStateAction<boolean>>;
  showExpenseModal: boolean;
  setShowExpenseModal: Dispatch<SetStateAction<boolean>>;
  showViewExpenseModal: boolean;
  setShowViewExpenseModal: Dispatch<SetStateAction<boolean>>;
};

// Create new Global Context
const GlobalContext = createContext<ContextTypes>({
  showIncomeModal: false,
  setShowIncomeModal: () => {},
  showExpenseModal: false,
  setShowExpenseModal: () => {},
  showViewExpenseModal: false,
  setShowViewExpenseModal: () => {},
});

// Create wrapper for Next.js client side rendering compatibility
export const GlobalContextProvider = ({ children }: any) => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showViewExpenseModal, setShowViewExpenseModal] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        showIncomeModal,
        setShowIncomeModal,
        showExpenseModal,
        setShowExpenseModal,
        showViewExpenseModal,
        setShowViewExpenseModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// create hook to use the Global Context
export const useGlobalContext = () => useContext(GlobalContext);
