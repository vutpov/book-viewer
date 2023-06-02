import React, { useContext } from "react";
import { BookContext } from "../reducer";
import FlipOnePage from "./FilpOnePage";
import FlipTwoPage from "./FlipTwoPage";
import FlipScroll from "./FlipScroll/FlipScroll";

export interface FlipBookChildrenProps {
  placeholder?: React.ReactNode;
  containerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
}

const FlipBookChildren: React.FC<FlipBookChildrenProps> = (props) => {
  const state = useContext(BookContext);

  let result = null;

  switch (state.viewType) {
    case "onePage":
      result = <FlipOnePage {...props} />;
      break;
    case "twoPage":
      result = <FlipTwoPage {...props} />;
      break;
    case "scroll":
      result = <FlipScroll {...props} />;
      break;
    default:
      result = <FlipOnePage {...props} />;
  }
  return result;
};

export default FlipBookChildren;
