import { ExpenseItem } from "@/context/store/FinanceContext";
import { currencyFormatter } from "@/lib/utils";
import React, { useState } from "react";

type Props = {
  id?: string;
  className?: string;
  onClick?: (category: string) => void;
  expense: ExpenseItem;
  selectedCategoryName?: string;
  isOpen?: boolean;
};

const ExpenseCategoryItem = (props: Props) => {
  const [isOpen, setIsOpen] = useState(props.isOpen || false);
  const isSelected = props.expense.title === props.selectedCategoryName;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(props.expense.title || "");
    }
  };

  const handleToggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <button onClick={handleClick}>
      <div
        id={props.id}
        className={`flex items-center justify-between mt-1 mb-1 ml-4 mr-4 px-4 py-4 rounded-3xl ${
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
        {props.expense.total != null && (
          <p>
            {props.expense.total === 0
              ? "$0"
              : currencyFormatter(props.expense.total)}
          </p>
        )}
      </div>
    </button>
  );
};

export default ExpenseCategoryItem;
