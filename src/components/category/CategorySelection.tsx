import { useFinanceContext } from "@/context/store/FinanceContext";
import React, { SetStateAction, Dispatch, useRef, useEffect } from "react";
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
    const title = titleRef.current?.value?.trim();
    const color = colorRef.current?.value;

    if (!title || !color) {
      toast.error("Title and color are required.");
      return;
    }

    try {
      await addCategoryItem({ title, color, total: 0, items: [] });
    } catch (error) {
      toast.error("Error adding new category:");
    }
    props.setShowNewCategory(false);
  };

  return (
    <div className="flex flex-col gap-3 mt-1 py-5 justify-center w-full">
      <input
        ref={titleRef}
        type="text"
        placeholder="Enter a new category..."
        className="w-full"
        required
      ></input>
      <div className="flex flex-row items-center justify-center">
        <label className="m-1" htmlFor="color">
          Pick a color:
        </label>
        <input
          id="color"
          type="color"
          ref={colorRef}
          className="min-w-[62px] w-[120px] h-10"
        ></input>

        <button
          type="button"
          onClick={() => {
            addCategoryHandler();
          }}
          className=" btn btn-primary-outline m-1"
        >
          Create
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            props.setShowNewCategory(false);
          }}
          className=" btn btn-danger m-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;
