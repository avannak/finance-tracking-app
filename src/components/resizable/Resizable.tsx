"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import "./Resizable.css";
import React, { forwardRef } from "react";
import { ResizableBox, ResizeHandle } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: any;
}

interface HandleComponentProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

// Custom handle component - Modified to use forwardRef
const HandleComponent = forwardRef<HTMLSpanElement, HandleComponentProps>(
  (props, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={`resizable-handle ${props.className ? props.className : ""}`}
      >
        <div className="dot-container">
          <div className="dot">•</div>
          <div className="dot">•</div>
          <div className="dot">•</div>
        </div>
      </span>
    );
  }
);
HandleComponent.displayName = "HandleComponent";

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const { navWidth, setNavWidth } = useGlobalContext();

  const resizeHandles: ResizeHandle[] =
    direction === "horizontal" ? ["e"] : ["s"];

  return (
    <ResizableBox
      height={Infinity}
      width={navWidth}
      maxConstraints={[300, Infinity]}
      minConstraints={[200, Infinity]}
      resizeHandles={resizeHandles}
      handle={(resizeHandle, ref) => <HandleComponent ref={ref} />}
      onResize={(event, data) => {
        setNavWidth(data.size.width);
      }}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
