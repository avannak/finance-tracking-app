import React from "react";

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const IncomePage = (props: Props) => {
  return (
    <div>
      <h1>Income Page</h1>
    </div>
  );
};

export default IncomePage;
