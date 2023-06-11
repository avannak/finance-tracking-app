import { useGlobalContext } from "@/context/GlobalContext";
import { useFinanceContext } from "@/context/store/FinanceContext";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CategorySelection from "../category/CategorySelection";
import ExpenseCategoryItem from "../category/ExpenseCategoryItem";

type Props = {};

const uniqueId = uuidv4();

const ExpensePageModal = (props: Props) => {
  const { showExpenseModal, setShowExpenseModal } = useGlobalContext();
  const { expenses, setExpenses, addExpenseItem } = useFinanceContext();
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffffff");

  const [showNewCategory, setShowNewCategory] = useState(false);

  // Create new Expense
  const addExpenseHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          { amount: +expenseAmount, createdAt: new Date(0), id: uniqueId },
        ],
        title: expense.title,
        total: expense.total + +expenseAmount,
      };
      console.log("submitted New Expense!", newExpense);

      try {
        await addExpenseItem(expense.id, newExpense);
      } catch (error: any) {
        console.log(error.message);
      }
      setSelectedCategoryId("");
      setSelectedCategoryName("");
      setExpenseAmount(0);
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
    console.log("newCategory pressed!");
  };

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
      <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
        <button
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
          onClick={() => showExpenseModal && setShowExpenseModal(false)}
        >
          X
        </button>
        <form onSubmit={addExpenseHandler}>
          <div className="input-group">
            <label htmlFor="expense">
              Please type in your expense and pick a category.
            </label>
            <input
              type="number"
              value={expenseAmount}
              onChange={(e: any) => {
                setExpenseAmount(e.target.value);
              }}
              min={0.01}
              step={0.01}
              placeholder="Enter income amount"
              required
            ></input>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between mx-auto w-full">
              <h1 className="text-center text-2xl">Select Expense Category</h1>
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
            {/* <ExpenseCategoryItem
              onClick={() => handleCategoryClick("Holidays")}
              color="#524"
              title="Holidays"
              selectedCategory={selectedCategory}
            />
            <ExpenseCategoryItem
              onClick={() => handleCategoryClick("Fuel")}
              color="#3ef3a2"
              title="Fuel"
              selectedCategory={selectedCategory}
            />
            <ExpenseCategoryItem
              onClick={() => handleCategoryClick("Food")}
              color="#f3f03e"
              title="Food"
              selectedCategory={selectedCategory}
            />
            <ExpenseCategoryItem
              onClick={() => handleCategoryClick("Entertainment")}
              color="#3e8cf3"
              title="Entertainment"
              selectedCategory={selectedCategory}
            />
            <ExpenseCategoryItem
              onClick={() => handleCategoryClick("Movies")}
              color="#f33e80"
              title="Movies"
              selectedCategory={selectedCategory}
            /> */}
            {expenseAmount > 0 && selectedCategoryId && (
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
