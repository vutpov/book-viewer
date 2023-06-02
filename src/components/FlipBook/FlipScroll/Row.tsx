import React, { useContext, useMemo, useRef } from "react";
import Img from "../../PinchZoomImg";
import { ActionType, BookContext } from "../../reducer";

import { useInViewport, useDebounceEffect } from "ahooks";

const Row: React.FC<any> = (props) => {
  const { index, style, src, ...rest } = props;
  const ref = useRef(null);
  const state = useContext(BookContext);
  let beginIndex = state.currIndex;

  const rootElementId = useMemo(() => {
    return `flip-scroll-container`;
  }, []);
  const [inViewport] = useInViewport(ref, {
    root: document.getElementById(rootElementId),
    threshold: [0.75, 1],
  });
  const { dispatch, isScrolling } = useContext(BookContext);

  useDebounceEffect(
    () => {
      if (inViewport && beginIndex !== index && isScrolling.current) {
        // changeIndex({
        //   index,
        //   scrollToItem: false,
        // });
        dispatch({
          type: ActionType.changePage,
          payload: { index, scrollToItem: false },
        });
      }
    },
    [inViewport, beginIndex],
    {
      wait: 90,
    }
  );

  return (
    <div
      {...rest}
      style={{
        ...style,
        textAlign: "center",
      }}
      ref={ref}
    >
      <Img
        imageSrc={src}
        style={{
          height: style.height,
          width: `100%`,
          objectFit: `contain`,
        }}
      />
      <div
        style={{
          height: 20,
        }}
      />
    </div>
  );
};

export default Row;
