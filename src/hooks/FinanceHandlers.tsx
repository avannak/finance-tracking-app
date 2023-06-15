// FinanceHandlers.tsx

import { useContext } from "react";
import {
  financeContextTypes,
  IncomeItem,
  useFinanceContext,
} from "@/context/store/FinanceContext";
import { FirebaseUser, useAuthContext } from "@/context/store/AuthContext";
import { toast } from "react-toastify";
import { currencyFormatter } from "@/lib/utils";

export function useAddIncomeHandler(
  amountRef: React.RefObject<HTMLInputElement>,
  descriptionRef: React.RefObject<HTMLInputElement>
) {
  const { user } = useAuthContext();
  const { addIncomeItem } = useFinanceContext();

  return async (e: React.FormEvent<HTMLFormElement>) => {
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
        toast.error(`Error adding new income entry`);
      }
    }
  };
}

export function useDeleteIncomeHandler() {
  const { removeIncomeItem } = useFinanceContext();

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

  return deleteIncomeHandler;
}
