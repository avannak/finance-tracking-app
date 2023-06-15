import IncomePage from "@/app/signin/page";
import React from "react";

type Props = {
  type: string;
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
};

const Modal = (props: Props) => {
  return (
    <div
      style={{
        transform: props.modalIsOpen ? "translateX(0%)" : "translateX(-200%)",
      }}
      className="absolute top-0 left-0 w-full h-full z-50 transition-all duration-500"
    >
      <div className="absolute top-10 left-0 w-full h-full z-50">
        <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
          <button
            className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
            onClick={() => props.modalIsOpen && props.setModalIsOpen(false)}
          >
            X
          </button>
          {props.type === "income" && <IncomePage />}
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
