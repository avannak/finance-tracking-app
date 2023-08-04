import React from "react";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";

const allIcons = { ...FaIcons, ...BsIcons };

type Props = {
  name: string;
  className?: string;
};

const Icon: React.FC<Props> = ({ name, className }) => {
  const IconComponent = (allIcons as any)[name];

  if (!IconComponent) {
    console.warn(`Icon with name '${name}' not found`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default Icon;
