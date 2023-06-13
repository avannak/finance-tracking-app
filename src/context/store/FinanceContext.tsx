"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
// Firebase
import { db } from "@/lib/firebase";
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export type IncomeItem = {
  uid?: string | null;
  id?: any;
  amount: number;
  description?: string;
  createdAt: Date;
};

export type ExpenseItem = {
  uid?: string | null;
  id?: any;
  color?: string;
  items: ExpenseItemObject[];
  title?: string;
  total: number;
};

export type ExpenseItemObject = {
  id?: any;
  amount: number;
  createdAt: Date;
};

export type financeContextTypes = {
  color?: string;
  title?: string;
  total?: number;
  income: IncomeItem[];
  setIncome: Dispatch<SetStateAction<IncomeItem[]>>;
  addIncomeItem: (newIncome: IncomeItem) => void;
  removeIncomeItem: (incomeId: string) => void;
  expenses: ExpenseItem[];
  setExpenses: Dispatch<SetStateAction<ExpenseItem[]>>;
  addExpenseItem: (expenseCategoryId: string, newExpense: ExpenseItem) => void;
  deleteExpenseItem: (
    updatedExpense: ExpenseItem,
    expenseCategoryId: string
  ) => void;
  addCategoryItem: (category: ExpenseItem) => void;
  deleteCategoryItem: (categoryId: string) => void;
};

const FinanceContext = createContext<financeContextTypes>({
  income: [],
  setIncome: () => {},
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  expenses: [],
  setExpenses: () => {},
  addExpenseItem: async () => {},
  deleteExpenseItem: async () => {},
  addCategoryItem: async () => {},
  deleteCategoryItem: async () => {},
});

export const FinanceContextProvider = ({ children }: any) => {
  const { user } = useAuthContext();
  // Initialize States here...
  const [income, setIncome] = useState<IncomeItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Add Income Item Function
  const addIncomeItem = async (newIncome: IncomeItem) => {
    const collectionRef = collection(db, "income");
    const userId = user?.uid || "";
    // console.log("addIncome ", userId);
    try {
      const docRef = await addDoc(collectionRef, { ...newIncome, uid: userId });
      newIncome.id = docRef.id;
      newIncome.uid = userId;
      setIncome((prev: IncomeItem[]) => [...prev, newIncome]);
    } catch (error: any) {
      throw error;
    }
  };

  // Remove Income Item Function
  const removeIncomeItem = async (incomeId: string) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prev) => {
        return prev.filter((income) => income.id !== incomeId);
      });
    } catch (error: any) {
      throw error;
    }
  };

  // Add Expense Item Function
  const addExpenseItem = async (
    expenseCategoryId: string,
    newExpense: ExpenseItem
  ) => {
    const docRef = doc(db, "expenses", expenseCategoryId);
    const userId = user?.uid || "";

    try {
      await updateDoc(docRef, {
        ...newExpense,
        uid: userId,
      });

      // Update State
      setExpenses((prevExpenses) => {
        const updatedExpenses: ExpenseItem[] = [...prevExpenses];

        const foundIndex = updatedExpenses.findIndex((expense: ExpenseItem) => {
          return expense.id === expenseCategoryId;
        });

        if (foundIndex !== -1) {
          updatedExpenses[foundIndex] = {
            ...updatedExpenses[foundIndex],
            id: expenseCategoryId,
            uid: userId,
            ...newExpense,
          };
        }
        localStorage.setItem("expenses", JSON.stringify(updatedExpenses)); // Update localStorage here
        return updatedExpenses;
      });
      // console.log("updated doc!");
    } catch (error: any) {
      throw error;
    }
  };

  // Delete Expense Item Function
  const deleteExpenseItem = async (
    updatedExpense: ExpenseItem,
    expenseCategoryId: string
  ) => {
    try {
      // get the reference to the document
      const docRef = doc(db, "expenses", expenseCategoryId);

      // fetch the document
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists) {
        console.log(`Document with ID ${expenseCategoryId} does not exist.`);
        return;
      }

      // update the document in Firestore
      await updateDoc(docRef, {
        ...updatedExpense,
      });

      // Fetch the updated document from Firestore
      const updatedDocSnap = await getDoc(docRef);
      const updatedData = updatedDocSnap.data() as ExpenseItem;

      setExpenses((prevExpenses) => {
        const updatedExpenses: ExpenseItem[] = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId
        );
        updatedExpenses[pos].items = updatedData.items;
        updatedExpenses[pos].total = updatedData.total;
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  // Add Category Item Function
  const addCategoryItem = async (category: ExpenseItem) => {
    const categoryTitle = category.title;
    const collectionRef = collection(db, "expenses");
    const userId = user?.uid || "";
    const Query = query(
      collectionRef,
      where("title", "==", categoryTitle),
      where("uid", "==", userId)
    );
    try {
      // Check if category exists first before adding new category
      const querySnapshot = await getDocs(Query);
      if (!querySnapshot.empty) {
        toast.error("Category already exists");
        return;
      }

      const newDocRef = doc(collectionRef);
      await setDoc(newDocRef, {
        ...category,
        uid: userId,
      });
      toast.success(`New Category: ${categoryTitle} added!`);
      // update state
      setExpenses((prev) => [...prev, { id: newDocRef.id, ...category }]);
    } catch (error) {
      throw error;
    }
  };

  // Delete Category Item Function
  const deleteCategoryItem = async (expenseCategoryId: string) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prevExpenses): any => {
        const updatedExpenses = prevExpenses.filter(
          (expenses) => expenses.id !== expenseCategoryId
        );
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  // Define Values Here:
  const values = {
    income,
    setIncome,
    addIncomeItem,
    removeIncomeItem,
    expenses,
    setExpenses,
    addExpenseItem,
    deleteExpenseItem,
    addCategoryItem,
    deleteCategoryItem,
  };

  useEffect(() => {
    if (!user) return;
    // Grab Income Data on load.
    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      // Grab data from user with uid
      if (user?.uid) {
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);
        const data = docsSnap.docs.map((doc: DocumentData) => {
          return {
            id: doc.id,
            uid: user.uid,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          };
        });
        setIncome(data);
      }
    };

    getIncomeData();
    // console.log(income, user);
  }, [user]); // Empty dependency array to run once on initial mount

  useEffect(() => {
    const fetchExpenses = async () => {
      const collectionRef = collection(db, "expenses");
      // Grab data from user with uid
      if (user?.uid) {
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);
        const data = docsSnap.docs.map((doc: DocumentData) => {
          return {
            id: doc.id,
            uid: user.uid,
            ...doc.data(),
          };
        });
        // Only update state if the new data is different
        if (JSON.stringify(data) !== JSON.stringify(expenses)) {
          setExpenses(data);
          localStorage.setItem(`expenses-${user.uid}`, JSON.stringify(data));
        }
      }
    };

    // If there is nothing in local storage or it is different from the state, fetch from DB
    // Fetch expenses from local storage for the specific user.
    const cachedExpenses = localStorage.getItem(`expenses-${user?.uid}`);

    if (
      !cachedExpenses ||
      (cachedExpenses && JSON.stringify(expenses) !== cachedExpenses)
    ) {
      fetchExpenses();
    }
  }, [expenses, user?.uid]);
  return (
    <FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
  );
};

export const useFinanceContext = () => useContext(FinanceContext);
