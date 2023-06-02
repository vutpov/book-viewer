import React, { useContext } from "react";
import { FlipBookChildrenProps } from "./FlipBookChildren";
import Img from "../PinchZoomImg";
import { BookContext } from "../reducer";

const FlipOnePage: React.FC<FlipBookChildrenProps> = () => {
  const state = useContext(BookContext);
  let beginIndex = state.currIndex;

  // console.log(state.src, beginIndex, state);
  return (
    <React.Fragment>
      <Img imageSrc={state.src[beginIndex]} />
    </React.Fragment>
  );
};

export default FlipOnePage;
