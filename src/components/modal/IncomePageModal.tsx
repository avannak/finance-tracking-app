"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useAuthContext } from "@/context/store/AuthContext";
import { useFinanceContext } from "@/context/store/FinanceContext";
import {
  useAddIncomeHandler,
  useDeleteIncomeHandler,
} from "@/hooks/FinanceHandlers";
import { currencyFormatter } from "@/lib/utils";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

type Props = {};

const IncomePageModal = (props: Props) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const { showIncomeModal, setShowIncomeModal, isDeleting, setIsDeleting } =
    useGlobalContext();
  const { income, setIncome, addIncomeItem, removeIncomeItem } =
    useFinanceContext();
  const { user } = useAuthContext();

  const addIncomeHandler = useAddIncomeHandler(amountRef, descriptionRef);

  const deleteIncomeHandler = useDeleteIncomeHandler();

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 transition-all duration-500 flex items-center justify-center"
        onClick={() => setShowIncomeModal(!showIncomeModal)}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // This makes the overlay semi-transparent
      />
      <div className="modal">
        <button
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
          onClick={() => showIncomeModal && setShowIncomeModal(false)}
        >
          X
        </button>
        <form className="input-group" onSubmit={addIncomeHandler}>
          <div className="input-group">
            <h1 className="text-2xl font-bold">Add New Income</h1>
            <label htmlFor="amount">Income Amount</label>
            <input
              id="amount"
              type="number"
              ref={amountRef}
              name="amount"
              min={0.01}
              step={0.01}
              placeholder="Enter income amount"
              required
            ></input>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              ref={descriptionRef}
              name="description"
              placeholder="Enter income description"
              required
              maxLength={200}
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Entry
          </button>
        </form>
        <div className="flex flex-col gap-4 mt-6">
          <h3 className="text-2xl font-bold">Income History</h3>
          {/* Entry History */}
          {income.map((income, id) => (
            <div className="flex justify-between item-center" key={id}>
              <div>
                <p className="font-semibold">{income.description}</p>
                <small className="text-xs">
                  {`Date created: ${income.createdAt}`}
                </small>
              </div>
              <p className="flex items-center gap-2">
                {currencyFormatter(income.amount)}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    deleteIncomeHandler(income);
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

export default IncomePageModal;
