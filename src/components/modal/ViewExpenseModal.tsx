import { useGlobalContext } from "@/context/GlobalContext";
import {
  ExpenseItem,
  ExpenseItemObject,
  useFinanceContext,
} from "@/context/store/FinanceContext";
import { currencyFormatter } from "@/lib/utils";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

type Props = {
  selectedExpense: ExpenseItem | null;
  setSelectedExpense: Dispatch<SetStateAction<ExpenseItem | null>>;
};

const ViewExpenseModal = (props: Props) => {
  const {
    showViewExpenseModal,
    setShowViewExpenseModal,
    isDeleting,
    setIsDeleting,
    showNewExpenseModal,
    setShowNewExpenseModal,
  } = useGlobalContext();
  const { deleteExpenseItem, deleteCategoryItem, addExpenseItem, expenses } =
    useFinanceContext();
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseItems, setExpenseItems] = useState<ExpenseItemObject[]>([]);
  const expenseDescriptionRef = useRef<HTMLInputElement>(null);

  // Create new Expense
  const addExpenseHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create unique id for every expense
    const uniqueId = uuidv4();

    // console.log("submitted!");
    if (props.selectedExpense) {
      const newExpense: ExpenseItem = {
        ...props.selectedExpense,
        items: [
          ...props.selectedExpense?.items,
          {
            amount: +expenseAmount,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            id: uniqueId,
            description: expenseDescriptionRef.current
              ? expenseDescriptionRef.current.value
              : "",
          },
        ],
        title: props.selectedExpense.title,
        total: props.selectedExpense.total + +expenseAmount,
      };
      console.log("submitted New Expense!", newExpense);

      try {
        await addExpenseItem(props.selectedExpense.id, newExpense);
        toast.success(
          `$${expenseAmount} added to ${props.selectedExpense.title}!`
        );
        setExpenseItems(newExpense.items);
        props.setSelectedExpense(newExpense);
      } catch (error: any) {
        toast.error(`Error adding new expense`);
      }
      setExpenseAmount("");
      if (expenseDescriptionRef.current) {
        expenseDescriptionRef.current.value = "";
      }
      setShowNewExpenseModal(false);
    }
  };

  // Delete Expense Item Handler
  const deleteExpenseItemHandler = async (item: ExpenseItemObject) => {
    setIsDeleting(true);
    // Remove expense item from list
    if (props.selectedExpense) {
      const updatedItems = props.selectedExpense.items.filter(
        (i) => i.id !== item.id
      );

      if (updatedItems) {
        const updatedExpense: ExpenseItem = {
          ...props.selectedExpense,
          items: updatedItems,
          total: props.selectedExpense.total - item.amount,
        };

        try {
          await deleteExpenseItem(updatedExpense, props.selectedExpense.id);
          toast.success(
            `Deleted expense value of ${currencyFormatter(
              item.amount
            )} from history!`
          );
          props.setSelectedExpense(updatedExpense); // Update the state in the parent component
        } catch (error) {
          toast.error(`Error deleting expense entry from history`);
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  // Delete Category Handler
  const deleteCategoryHandler = async (expense: ExpenseItem | null) => {
    if (expense === null) {
      toast.error("No category to delete.");
      return;
    }
    try {
      setIsDeleting(true);
      await deleteCategoryItem(expense?.id);
      setIsDeleting(false);
      toast.success(`Category: ${expense.title} deleted!`);
      setShowViewExpenseModal(false);
    } catch (error) {
      throw toast.error(`Error deleting category entry`);
    }
  };

  // Update expense items
  useEffect(() => {
    if (props.selectedExpense) {
      // Create a deep copy of the items array
      const copiedItems = JSON.parse(
        JSON.stringify(props.selectedExpense.items)
      );
      setExpenseItems(copiedItems);
    }
  }, [props.selectedExpense]);

  if (!props.selectedExpense) {
    return (
      <div className="absolute top-10 left-0 w-full h-full z-10">
        <div
          className="fixed top-0 left-0 w-full h-full -z-10 transition-all duration-500 flex items-center justify-center"
          onClick={() => setShowViewExpenseModal(!showViewExpenseModal)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // This makes the overlay semi-transparent
        />
        <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
          <button
            className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
            onClick={() =>
              showViewExpenseModal && setShowViewExpenseModal(false)
            }
          >
            X
          </button>
          <h3>Expense data does not exist...</h3>
        </div>
      </div>
    );
  }

  if (props.selectedExpense.items.length < 1) {
    return (
      <div className="absolute top-10 left-0 w-full h-full z-10">
        <div
          className="fixed top-0 left-0 w-full h-full -z-10 transition-all duration-500 flex items-center justify-center"
          onClick={() => setShowViewExpenseModal(!showViewExpenseModal)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // This makes the overlay semi-transparent
        />
        <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
          <button
            className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
            onClick={() =>
              showViewExpenseModal && setShowViewExpenseModal(false)
            }
          >
            X
          </button>
          <div className="flex flex-row gap-4 justify-between">
            <h3 className="text-4xl">{props.selectedExpense.title}</h3>
            <button
              type="button"
              className="btn btn-danger"
              disabled={isDeleting}
              onClick={() => deleteCategoryHandler(props.selectedExpense)}
            >
              Delete
            </button>
          </div>
          <h3 className="gap-4 m-8 text-center">
            There are no expenses in this category. Try adding an expense.
          </h3>
          {showNewExpenseModal && (
            <div className="w-full">
              <form onSubmit={addExpenseHandler}>
                <div className="flex flex-col gap-3 mt-1 py-5">
                  <label htmlFor="expense">Expense Amount</label>
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
                    Please add a description for your expense.
                  </label>
                  <input
                    ref={expenseDescriptionRef}
                    id="description"
                    type="text"
                    maxLength={200}
                    placeholder="Enter expense description"
                    required
                  />
                  <div className="flex m-2">
                    <button type="submit" className="btn btn-primary mr-2">
                      + Add Expense
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => setShowNewExpenseModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {!showNewExpenseModal && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowNewExpenseModal(true)}
            >
              + Add new expense
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 transition-all duration-500 flex items-center justify-center"
        onClick={() => setShowViewExpenseModal(!showViewExpenseModal)}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // This makes the overlay semi-transparent
      />
      <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
        <button
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
          onClick={() => showViewExpenseModal && setShowViewExpenseModal(false)}
        >
          X
        </button>
        <div className="flex flex-row gap-4 justify-between">
          <h3 className="text-4xl">{props.selectedExpense.title}</h3>
          <button
            type="button"
            className="btn btn-danger"
            disabled={isDeleting}
            onClick={() => deleteCategoryHandler(props.selectedExpense)}
          >
            Delete
          </button>
        </div>
        {showNewExpenseModal && (
          <div className="w-full">
            <form onSubmit={addExpenseHandler}>
              <div className="flex flex-col gap-3 mt-1 py-5">
                <label htmlFor="expense">Expense Amount</label>
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
                  Please add a description for your expense.
                </label>
                <input
                  ref={expenseDescriptionRef}
                  id="description"
                  type="text"
                  maxLength={200}
                  placeholder="Enter expense description"
                  required
                />
                <div className="flex m-2">
                  <button type="submit" className="btn btn-primary mr-2">
                    + Add Expense
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => setShowNewExpenseModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {!showNewExpenseModal && (
          <div className="mx-auto py-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowNewExpenseModal(true)}
            >
              + Add new expense
            </button>
          </div>
        )}
        <div>
          <h3 className="text-xl my-6">Expense History</h3>
          {props.selectedExpense.items
            .sort(
              (a, b) =>
                b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
            ) // Sort items by descending order of createdAt timestamps
            .map((item: any, id) => (
              <div className="flex justify-between item-center" key={item.id}>
                <div>
                  <p className="font-semibold">
                    {item.description ? item.description : item.id}
                  </p>
                  <small className="text-xs">
                    {`Date created: ${item.createdAt.toDate()}`}
                  </small>
                </div>
                <p className="flex items-center gap-2">
                  {currencyFormatter(item.amount)}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      deleteExpenseItemHandler(item);
                    }}
                  >
                    <FaRegTrashAlt></FaRegTrashAlt>
                  </button>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ViewExpenseModal;
