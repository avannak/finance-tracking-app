"use client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import Modal from "@/components/modal/Modal";

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExpensePage = (props: Props) => {
  // Render the component only on the client side
  return (
    <div>
      {/* Your Expenses page content */}
      {/* ... */}

      {/* Expenses modal */}
    </div>
  );
};

export default ExpensePage;
