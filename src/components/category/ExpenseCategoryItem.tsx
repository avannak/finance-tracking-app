import { ExpenseItem } from "@/context/store/FinanceContext";
import { currencyFormatter } from "@/lib/utils";
import React, { useState } from "react";

type Props = {
  id?: string;
  onClick?: (category: string) => void;
  expense: ExpenseItem;
  selectedCategoryName?: string;
};

const ExpenseCategoryItem = (props: Props) => {
  const isSelected = props.expense.title === props.selectedCategoryName;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(props.expense.title || "");
    }
  };
  return (
    <button onClick={handleClick}>
      <div
        id={props.id}
        className={`flex items-center justify-between px-4 py-4 rounded-3xl ${
          isSelected ? "bg-green-500" : "bg-slate-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-yellow-500"
            style={{ backgroundColor: props.expense.color }}
          />
          <h4>{props.expense.title}</h4>
        </div>
        {props.expense.total && <p>{currencyFormatter(props.expense.total)}</p>}
      </div>
    </button>
  );
};

export default ExpenseCategoryItem;
