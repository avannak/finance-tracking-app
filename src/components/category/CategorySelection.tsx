import { useFinanceContext } from "@/context/store/FinanceContext";
import React, {
  SetStateAction,
  Dispatch,
  RefObject,
  useRef,
  useEffect,
} from "react";
import { toast } from "react-toastify";

type Props = {
  showNewCategory: boolean;
  setShowNewCategory: Dispatch<SetStateAction<boolean>>;
};

const CategorySelection = (props: Props) => {
  const { addCategoryItem } = useFinanceContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const addCategoryHandler = async () => {
    const title = titleRef.current?.value ?? "";
    const color = colorRef.current?.value ?? "";
    // console.log(title, color);

    try {
      await addCategoryItem({ title, color, total: 0, items: [] });
      toast.success(`New Category: ${title} added!`);
    } catch (error) {
      toast.error("Error adding new category:");
    }
    props.setShowNewCategory(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-1 py-5">
      <input
        ref={titleRef}
        type="text"
        placeholder="Enter a new category..."
        className="w-full sm:w-auto"
      ></input>
      <label htmlFor="color">Pick Color: </label>
      <input
        id="color"
        type="color"
        ref={colorRef}
        className="w-24 h-10"
      ></input>
      <button
        type="button"
        onClick={() => {
          addCategoryHandler();
        }}
        className="btn btn-primary-outline"
      >
        Create
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          props.setShowNewCategory(false);
        }}
        className="btn btn-danger"
      >
        Cancel
      </button>
    </div>
  );
};

export default CategorySelection;
