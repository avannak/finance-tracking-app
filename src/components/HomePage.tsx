"use client";
import ExpenseCategoryItem from "@/components/category/ExpenseCategoryItem";
import ExpensePageModal from "@/components/modal/ExpensePageModal";
import IncomePageModal from "@/components/modal/IncomePageModal";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { currencyFormatter } from "../lib/utils";
ChartJS.register(ArcElement, Tooltip, Legend);
import { useGlobalContext } from "@/context/GlobalContext";
import {
  ExpenseItem,
  IncomeItem,
  useFinanceContext,
} from "@/context/store/FinanceContext";
import ViewExpenseModal from "@/components/modal/ViewExpenseModal";
import { formatDate } from "@/utils/formatDate";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteIncomeHandler } from "@/hooks/FinanceHandlers";
import CategorySelection from "./category/CategorySelection";
import Link from "next/link";

type Props = {};

const HomePage = (props: Props) => {
  const {
    showExpenseModal,
    setShowExpenseModal,
    showIncomeModal,
    setShowIncomeModal,
    showViewExpenseModal,
    setShowViewExpenseModal,
    showExpenses,
    setShowExpenses,
    showIncome,
    setShowIncome,
  } = useGlobalContext();
  const [balance, setBalance] = useState(0);
  const [incomeStatus, setIncomeStatus] = useState(0);
  const [expensesStatus, setExpensesStatus] = useState(0);
  // Create New Category State
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffffff");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const [latestIncomeList, setLatestIncomeList] = useState<
    IncomeItem[] | null
  >();
  const { expenses, income } = useFinanceContext();
  const { isDeleting } = useGlobalContext();
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const deleteIncomeHandler = useDeleteIncomeHandler();

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

  // Create new Category
  const handleNewCategory = async () => {
    setShowNewCategory(true);
    // console.log("newCategory pressed!");
  };

  function convertToDate(dateString: string): Date {
    // Implement your logic to convert the dateString to a valid date format
    // Example: return new Date(dateString);
    return new Date(dateString);
  }

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
    // Calculate the Total Income
    const newIncomeStatus = income.reduce((total, income) => {
      return total + Number(income.amount);
    }, 0);
    setIncomeStatus(newIncomeStatus);
    // Calculate the Total Expenses
    const newExpensesStatus = expenses.reduce((total, expense) => {
      return total + expense.total;
    }, 0);
    setExpensesStatus(newExpensesStatus);

    // Get latest income list
    const latestIncome = income
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    setLatestIncomeList(latestIncome);
  }, [expenses, income]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight);
    }
  }, [showExpenses]);

  return (
    <div className="flex items-center container max-w-2xl px-6 py-6 mx-auto ">
      <main className="container max-w-2xl px-6 max-auto">
        {/* My Balance */}
        <section>
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>
        {/* Income */}
        <section className="flex justify-center items-left flex-col cursor-pointer bg-slate-800 rounded-2xl mt-4 mb-2">
          <div
            className="flex justify-between rounded-2xl items-center bg-slate-800 h-full w-full p-4"
            onClick={() => setShowIncome(!showIncome)}
          >
            <h3 className="text-2xl">Income</h3>
            {showIncome && (
              <div className=" text-lime-400 mr-2">
                {currencyFormatter(incomeStatus)}
              </div>
            )}
            {!showIncome && (
              <div className=" text-lime-400 mr-2">
                {currencyFormatter(incomeStatus)}
              </div>
            )}
          </div>
          <div
            className={`flex flex-col justify-center collapsible overflow-hidden ml-4 mr-4 ${
              showIncome ? "max-h-[500px]" : "max-h-0"
            }`}
            style={{
              maxHeight: showIncome ? "500px" : "0",
              overflowY: "auto",
              paddingBottom: showIncome ? "10px" : "0", // Added padding to the bottom
            }}
            ref={containerRef}
          >
            {latestIncomeList?.map((incomeItem, id) => (
              <div className="flex justify-between item-center p-1" key={id}>
                <div>
                  <p className="font-semibold">{incomeItem.description}</p>
                  <small className="text-xs">
                    {`Date created: ${formatDate(incomeItem.createdAt)}`}
                  </small>
                </div>
                <p className="flex items-center gap-2">
                  {currencyFormatter(incomeItem.amount)}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      deleteIncomeHandler(incomeItem);
                    }}
                  >
                    <FaRegTrashAlt></FaRegTrashAlt>
                  </button>
                </p>
              </div>
            ))}
          </div>
          {showIncome && (
            <div className="m-4">
              <div className="flex w-full justify-between items-center text-center">
                <Link href="/income">
                  <button className="btn btn-primary flex m-2">
                    Income history
                  </button>
                </Link>
                <p className="flex items-center gap-2 text-xl p-1">
                  Total: {currencyFormatter(incomeStatus)}
                </p>
              </div>
              <div className="flex w-full justify-end items-center">
                <button
                  className="btn btn-primary-outline flex m-2"
                  onClick={handleIncomeModal}
                >
                  + Add New Income
                </button>
                {/* <button className="btn btn-primary-outline flex m-2">
                  More details
                </button> */}
              </div>
            </div>
          )}
        </section>
        {/* Expenses */}
        <section className="flex justify-center items-left flex-col cursor-pointer bg-slate-800 rounded-2xl mt-2 mb-2">
          <div
            className="flex justify-between rounded-2xl items-center bg-slate-800 h-full w-full p-4"
            onClick={() => setShowExpenses(!showExpenses)}
          >
            <h3 className="text-2xl">Expenses</h3>
            {showExpenses && (
              <div className=" text-lime-400 mr-2">
                {currencyFormatter(expensesStatus)}
              </div>
            )}
            {!showExpenses && (
              <div className=" text-lime-400 mr-2">
                {currencyFormatter(expensesStatus)}
              </div>
            )}
          </div>
          <div
            className={`flex flex-col justify-center collapsible overflow-hidden ml-4 mr-4 ${
              showExpenses ? "max-h-[1000px]" : "max-h-0"
            }`}
            style={{
              maxHeight: showExpenses ? "1000px" : "0",
              overflowY: "auto",
              paddingBottom: showExpenses ? "10px" : "0", // Added padding to the bottom
            }}
            ref={containerRef}
          >
            {expenses &&
              expenses.map((expense) => (
                <ExpenseCategoryItem
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleViewExpenseModal(expense)}
                  className={`expense-item ${showExpenses ? "active" : ""}`}
                />
              ))}
          </div>
          {showExpenses && (
            <div className="m-4">
              <div className="flex w-full justify-end items-center p-3 text-center">
                <p className="flex items-center gap-2 text-xl p-1">
                  Total Expenses: {currencyFormatter(expensesStatus)}
                </p>
              </div>
              <div className="flex w-full justify-between items-center p-3">
                {!showNewCategory && (
                  <button
                    onClick={handleNewCategory}
                    className="btn-primary-no-outline"
                  >
                    + New Category
                  </button>
                )}
                {showNewCategory && (
                  <CategorySelection
                    showNewCategory={showNewCategory}
                    setShowNewCategory={setShowNewCategory}
                  />
                )}

                <button
                  className="btn btn-primary-outline flex m-2"
                  onClick={handleExpenseModal}
                >
                  + Add New Expense
                </button>
                {/* <button className="btn btn-primary-outline flex m-2">
                  More details
                </button> */}
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>

          {expenses && (
            <div className="flex flex-col gap-4 mt-6 w-full mx-auto h-96">
              <Doughnut
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
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
        className="fixed top-0 left-0 w-full h-full z-10 transition-all duration-500"
      >
        <ExpensePageModal />
      </div>
      <div
        style={{
          transform: showIncomeModal ? "translateX(0%)" : "translateX(-200%)",
          transition: "transform 0.5s ease-in-out",
        }}
        className="fixed top-0 left-0 w-full h-full z-10 transition-all duration-500"
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
        className="fixed top-0 left-0 w-full h-full z-10 transition-all duration-500"
      >
        <ViewExpenseModal
          selectedExpense={selectedExpense}
          setSelectedExpense={setSelectedExpense}
        />
      </div>
    </div>
  );
};

export default HomePage;
