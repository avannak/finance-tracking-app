import { useGlobalContext } from "@/context/GlobalContext";
import { useFinanceContext } from "@/context/store/FinanceContext";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CategorySelection from "../category/CategorySelection";
import ExpenseCategoryItem from "../category/ExpenseCategoryItem";
import { toast } from "react-toastify";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

type Props = {};

const ExpensePageModal = (props: Props) => {
  const { showExpenseModal, setShowExpenseModal } = useGlobalContext();
  const { expenses, setExpenses, addExpenseItem } = useFinanceContext();
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffffff");
  const expenseDescriptionRef = useRef<HTMLInputElement>(null);

  const [showNewCategory, setShowNewCategory] = useState(false);

  // Create new Expense
  const addExpenseHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create unique id for every expense
    const uniqueId = uuidv4();

    // Find the category to add the expense to
    const expense = expenses.find((expense) => {
      console.log(expense.id);
      return expense.id === selectedCategoryId;
    });

    // console.log("submitted!");
    if (expense) {
      const newExpense = {
        color: expense.color,
        items: [
          ...expense.items,
          {
            amount: +expenseAmount,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            id: uniqueId,
            description: expenseDescriptionRef.current
              ? expenseDescriptionRef.current.value
              : "",
          },
        ],
        title: expense.title,
        total: expense.total + +expenseAmount,
      };
      console.log("submitted New Expense!", newExpense);

      try {
        await addExpenseItem(expense.id, newExpense);
        toast.success(`$${expenseAmount} added to ${expense.title}!`);
      } catch (error: any) {
        toast.error(`Error adding new expense`);
      }
      setSelectedCategoryId("");
      setSelectedCategoryName("");
      setExpenseAmount("");
      if (expenseDescriptionRef.current) {
        expenseDescriptionRef.current.value = "";
      }
      setShowExpenseModal(false);
    }
  };

  // handle clicking Category
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    // console.log(categoryName);
  };

  // Create new Category
  const handleNewCategory = async () => {
    setShowNewCategory(true);
    // console.log("newCategory pressed!");
  };

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 transition-all duration-500 flex items-center justify-center"
        onClick={() => setShowExpenseModal(!showExpenseModal)}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // This makes the overlay semi-transparent
      />
      <div className="modal">
        <button
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
          onClick={() => showExpenseModal && setShowExpenseModal(false)}
        >
          X
        </button>
        <form onSubmit={addExpenseHandler}>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between mx-auto w-full">
              <h1 className="text-center text-2xl font-bold">
                Select Category for Expense
              </h1>
              {!showNewCategory && (
                <button
                  onClick={handleNewCategory}
                  className="btn-primary-no-outline"
                >
                  + New Category
                </button>
              )}
            </div>
            {showNewCategory && (
              <CategorySelection
                showNewCategory={showNewCategory}
                setShowNewCategory={setShowNewCategory}
              />
            )}
            <div className="flex flex-col">
              {expenses.map((expense, id) => (
                <ExpenseCategoryItem
                  key={id}
                  id={expense.id}
                  onClick={() => {
                    handleCategoryClick(
                      expense.id,
                      expense.title ? expense.title : ""
                    );
                  }}
                  expense={expense}
                  selectedCategoryName={selectedCategoryName}
                />
              ))}
            </div>
          </div>
          <div className="input-group flex flex-col gap-4 mt-6">
            <h1 className="text-2xl font-bold">Add New Expense</h1>
            <label htmlFor="expense">
              How much would you like to add to your expense category?
            </label>
            <input
              id="expense"
              type="number"
              value={expenseAmount}
              onChange={(e: any) => {
                setExpenseAmount(e.target.value);
              }}
              min={0.01}
              step={0.01}
              placeholder="Enter expense amount"
              required
            ></input>
            <label htmlFor="description">
              Optional: Add a description for your expense.
            </label>
            <input
              ref={expenseDescriptionRef}
              id="description"
              type="text"
              maxLength={200}
              placeholder="Enter expense description"
            ></input>
            {parseFloat(expenseAmount) > 0 && selectedCategoryId && (
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpensePageModal;
