"use client";
import ExpenseCategoryItem from "@/components/category/ExpenseCategoryItem";
import ExpensePageModal from "@/components/modal/ExpensePageModal";
import IncomePageModal from "@/components/modal/IncomePageModal";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { currencyFormatter } from "../lib/utils";
ChartJS.register(ArcElement, Tooltip, Legend);
import { useGlobalContext } from "@/context/GlobalContext";
import { ExpenseItem, useFinanceContext } from "@/context/store/FinanceContext";
import ViewExpenseModal from "@/components/modal/ViewExpenseModal";

const DUMMY_DATA = [
  { id: 1, title: "Entertainment", color: "#c8d816", total: 500 },
  { id: 2, title: "Gas", color: "#fe5d5d", total: 500 },
  { id: 3, title: "Fuel", color: "#f8bf3a", total: 600 },
  { id: 4, title: "Food", color: "#3bff4f", total: 200 },
  { id: 5, title: "Business Expenses", color: "#2c48d2", total: 90000 },
  { id: 6, title: "Stocks", color: "#894eff", total: 12500 },
];

export default function Home() {
  const {
    showExpenseModal,
    setShowExpenseModal,
    showIncomeModal,
    setShowIncomeModal,
    showViewExpenseModal,
    setShowViewExpenseModal,
  } = useGlobalContext();
  const [balance, setBalance] = useState(0);
  const { expenses, income } = useFinanceContext();
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(
    null
  );

  const handleExpenseModal = () => {
    setShowExpenseModal(true);
  };

  const handleIncomeModal = () => {
    setShowIncomeModal(true);
  };

  const handleViewExpenseModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setShowViewExpenseModal(true);
  };

  useEffect(() => {
    // Calculate the Balance
    const newBalance =
      income.reduce((total, income) => {
        return total + Number(income.amount);
      }, 0) -
      expenses.reduce((total, expense) => {
        return total + expense.total;
      }, 0);

    setBalance(newBalance);
  }, [expenses, income]);

  return (
    <div className="flex items-center container max-w-2xl px-6 py-6 mx-auto ">
      <main className="container max-w-2xl px-6 max-auto">
        {/* My Balance */}
        <section>
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button className="btn btn-primary" onClick={handleExpenseModal}>
            + Expenses
          </button>
          <button
            className="btn btn-primary-outline"
            onClick={handleIncomeModal}
          >
            + Income
          </button>
        </section>

        {/* Expenses */}
        <section className="py-6">
          <h3 className="text-2xl">My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses &&
              expenses.map((expense) => (
                <ExpenseCategoryItem
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleViewExpenseModal(expense)}
                />
              ))}
          </div>
        </section>

        {/* Stats */}
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>

          {expenses && (
            <div className="flex flex-col gap-4 mt-6 w-1/2 mx-auto">
              <Doughnut
                data={{
                  labels: expenses.map((expense) => expense.title),
                  datasets: [
                    {
                      label: "Expenses",
                      data: expenses.map((expense) => expense.total),
                      backgroundColor: expenses.map((expense) => expense.color),
                      borderColor: ["#050404"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <div
        style={{
          transform: showExpenseModal ? "translateX(0%)" : "translateX(-200%)",
          transition: "transform 0.5s ease-in-out",
        }}
        className="absolute top-0 left-0 w-full h-full z-10 transition-all duration-500"
      >
        <ExpensePageModal />
      </div>
      <div
        style={{
          transform: showIncomeModal ? "translateX(0%)" : "translateX(-200%)",
          transition: "transform 0.5s ease-in-out",
        }}
        className="absolute top-0 left-0 w-full h-full z-10 transition-all duration-500"
      >
        <IncomePageModal
        // @ts-ignore
        />
      </div>
      <div
        style={{
          transform: showViewExpenseModal
            ? "translateX(0%)"
            : "translateX(-200%)",
          transition: "transform 0.5s ease-in-out",
        }}
        className="absolute top-0 left-0 w-full h-full z-10 transition-all duration-500"
      >
        <ViewExpenseModal selectedExpense={selectedExpense} />
      </div>
    </div>
  );
}
