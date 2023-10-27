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
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  showExpenses: boolean;
  setShowExpenses: Dispatch<SetStateAction<boolean>>;
  showIncome: boolean;
  setShowIncome: Dispatch<SetStateAction<boolean>>;
  showNewExpenseModal: boolean;
  setShowNewExpenseModal: Dispatch<SetStateAction<boolean>>;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  navWidth: number;
  setNavWidth: Dispatch<SetStateAction<number>>;
};

// Create new Global Context
const GlobalContext = createContext<ContextTypes>({
  showIncomeModal: false,
  setShowIncomeModal: () => {},
  showExpenseModal: false,
  setShowExpenseModal: () => {},
  showViewExpenseModal: false,
  setShowViewExpenseModal: () => {},
  isDeleting: false,
  setIsDeleting: () => {},
  showExpenses: true,
  setShowExpenses: () => {},
  showIncome: true,
  setShowIncome: () => {},
  showNewExpenseModal: false,
  setShowNewExpenseModal: () => {},
  showNav: true,
  setShowNav: () => {},
  navWidth: 300,
  setNavWidth: () => {},
});

// Create wrapper for Next.js client side rendering compatibility
export const GlobalContextProvider = ({ children }: any) => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showViewExpenseModal, setShowViewExpenseModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showIncome, setShowIncome] = useState(true);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [navWidth, setNavWidth] = useState(300);
  return (
    <GlobalContext.Provider
      value={{
        showIncomeModal,
        setShowIncomeModal,
        showExpenseModal,
        setShowExpenseModal,
        showViewExpenseModal,
        setShowViewExpenseModal,
        isDeleting,
        setIsDeleting,
        showExpenses,
        setShowExpenses,
        showIncome,
        setShowIncome,
        showNewExpenseModal,
        setShowNewExpenseModal,
        showNav,
        setShowNav,
        navWidth,
        setNavWidth,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// create hook to use the Global Context
export const useGlobalContext = () => useContext(GlobalContext);
