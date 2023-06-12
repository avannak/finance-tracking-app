"use client";

import React, { useRef, useState, useEffect } from "react";
import ExpenseCategoryItem from "../category/ExpenseCategoryItem";
import { currencyFormatter } from "@/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { useGlobalContext } from "@/context/GlobalContext";
import {
  IncomeItem,
  useFinanceContext,
  financeContextTypes,
} from "@/context/store/FinanceContext";
import { useAuthContext } from "@/context/store/AuthContext";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatDate";

type Props = {};

const IncomePageModal = (props: Props) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const { showIncomeModal, setShowIncomeModal } = useGlobalContext();
  const { income, setIncome, addIncomeItem, removeIncomeItem } =
    useFinanceContext();
  const { user } = useAuthContext();

  const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amountRef.current && descriptionRef.current) {
      const newIncome: IncomeItem = {
        amount: +amountRef.current.value,
        uid: user?.uid,
        description: descriptionRef.current.value,
        createdAt: new Date(),
      };

      try {
        await addIncomeItem(newIncome);
        toast.success(
          `New income of ${currencyFormatter(amountRef.current.value)} added!`
        );
        descriptionRef.current.value = "";
        amountRef.current.value = "";
      } catch (error: any) {
        throw toast.error(`Error adding new income entry`);
      }
    }
  };

  const deleteIncomeHandler = async (income: IncomeItem) => {
    try {
      await removeIncomeItem(income.id);
      toast.success(
        `Deleted income value of ${currencyFormatter(
          income.amount
        )} from history!`
      );
    } catch (error: any) {
      toast.error(`Error deleting income entry from history`);
    }
  };

  return (
    <div className="absolute top-10 left-0 w-full h-full z-10">
      <div className="modal">
        <button
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
          onClick={() => showIncomeModal && setShowIncomeModal(false)}
        >
          X
        </button>
        {/* <h1>Income</h1> */}
        <form className="input-group" onSubmit={addIncomeHandler}>
          <div className="input-group">
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
                  {formatDate(income.createdAt.toISOString())}
                </small>
              </div>
              <p className="flex items-center gap-2">
                {currencyFormatter(income.amount)}
                <button
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
