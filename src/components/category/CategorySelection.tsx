import { useFinanceContext } from "@/context/store/FinanceContext";
import React, { SetStateAction, Dispatch, RefObject, useRef } from "react";

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
    console.log(title, color);

    try {
      await addCategoryItem({ title, color, total: 0, items: [] });
    } catch (error) {
      throw error;
    }
    props.setShowNewCategory(false);
  };

  return (
    <div className="flex flex-row gap-3 mt-1 py-5">
      <input
        ref={titleRef}
        type="text"
        placeholder="Enter a new category..."
      ></input>
      <label>Pick Color: </label>
      <input type="color" ref={colorRef} className="w-24 h-10"></input>
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
