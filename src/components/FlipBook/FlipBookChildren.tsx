import React, { useContext } from "react";
import { BookContext } from "../reducer";
import FlipOnePage from "./FilpOnePage";
import FlipTwoPage from "./FlipTwoPage";

export interface FlipBookChildrenProps {
  placeholder?: React.ReactNode;
  containerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
}

const FlipBookChildren: React.FC<FlipBookChildrenProps> = (props) => {
  const state = useContext(BookContext);

  let children =
    state.viewType === "onePage" ? (
      <FlipOnePage {...props} />
    ) : (
      <FlipTwoPage {...props} />
    );

  return children;
};

export default FlipBookChildren;
