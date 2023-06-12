import { useGlobalContext } from "@/context/GlobalContext";
import {
  ExpenseItem,
  ExpenseItemObject,
  useFinanceContext,
} from "@/context/store/FinanceContext";
import { currencyFormatter } from "@/lib/utils";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

type Props = { selectedExpense: ExpenseItem | null };

const ViewExpenseModal = (props: Props) => {
  const { showViewExpenseModal, setShowViewExpenseModal } = useGlobalContext();
  const { deleteExpenseItem, deleteCategoryItem } = useFinanceContext();

  // Delete Expense Item Handler
  const deleteExpenseItemHandler = async (item: ExpenseItemObject) => {
    // console.log("Delete Expense Item Clicked", item);
    try {
      if (
        props.selectedExpense &&
        typeof props.selectedExpense.total === "number" &&
        typeof item.amount === "number"
      ) {
        // Remove expense item from list
        const updatedItems = props.selectedExpense.items.filter(
          (i) => i.id !== item.id
        );

        if (updatedItems) {
          const updatedExpense: ExpenseItem = {
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
          } catch (error) {
            throw toast.error(`Error deleting expense entry from history`);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // Delete Category Handler
  const deleteCategoryHandler = async (expense: ExpenseItem | null) => {
    if (expense === null) {
      toast.error("No category to delete.");
      return;
    }
    try {
      await deleteCategoryItem(expense?.id);
      toast.success(`Category: ${expense.title} deleted!`);
      setShowViewExpenseModal(false);
    } catch (error) {
      throw toast.error(`Error deleting category entry`);
    }
  };

  if (!props.selectedExpense) {
    return (
      <div className="absolute top-10 left-0 w-full h-full z-10">
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
              onClick={() => deleteCategoryHandler(props.selectedExpense)}
            >
              Delete
            </button>
          </div>
          <h3 className="gap-4 text-2xl mt-8 text-center">
            There are no expenses in this category. Try adding an expense.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
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
            onClick={() => deleteCategoryHandler(props.selectedExpense)}
          >
            Delete
          </button>
        </div>
        <div>
          <h3 className="text-xl my-6">Expense History</h3>
          {props.selectedExpense.items.map((item: any, id) => (
            <div className="flex justify-between item-center" key={item.id}>
              <div>
                <p className="font-semibold">{item.id}</p>
                <small className="text-xs">
                  {item.createdAt.toMillis
                    ? new Date(item.createdAt.toMillis()).toISOString()
                    : item.createdAt.toISOString()}
                </small>
              </div>
              <p className="flex items-center gap-2">
                {currencyFormatter(item.amount)}
                <button
                  type="button"
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
