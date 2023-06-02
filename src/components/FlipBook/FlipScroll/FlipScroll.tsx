import React, { useContext, useEffect, useRef } from "react";
import { FlipBookChildrenProps } from "../FlipBookChildren";
import { BookContext } from "../../reducer";
import AutoSizer from "react-virtualized-auto-sizer";
import { useDebounceEffect } from "ahooks";
import { Virtuoso } from "react-virtuoso";
import { VirtuosoHandle } from "react-virtuoso";
import { btnNextId, btnPrevId } from "../../PageNavigator/PageNavigator";
import Row from "./Row";
import ScrollIndicator from "./ScrollIndicator";

const FlipScroll: React.FC<FlipBookChildrenProps> = () => {
  const state = useContext(BookContext);
  let beginIndex = state.currIndex;
  const virtualListRef = useRef<VirtuosoHandle>(null);

  useDebounceEffect(
    () => {
      if (state.scrollToItem) {
        virtualListRef.current?.scrollToIndex(beginIndex);
      }
    },
    [beginIndex, state.scrollToItem],
    {
      wait: 100,
    }
  );

  useEffect(() => {
    state.isScrolling.current = false;
  }, []);

  useEffect(() => {
    const toggleVisible = (visible: boolean) => {
      const btnNext = document.getElementById(btnNextId);
      const btnPrev = document.getElementById(btnPrevId);

      [btnNext, btnPrev].forEach((btn) => {
        btn.style.visibility = visible ? "visible" : "hidden";
      });
    };

    toggleVisible(false);

    return () => {
      toggleVisible(true);
    };
  }, []);

  return (
    <>
      <AutoSizer>
        {({ height, width }: any) => {
          const gap = 20;
          const itemHeight = height - gap;

          return (
            <Virtuoso
              id="flip-scroll-container"
              style={{ height, width }}
              data={state.src}
              fixedItemHeight={itemHeight}
              ref={virtualListRef}
              overscan={5 * itemHeight}
              itemContent={(index, src) => {
                return (
                  <Row
                    src={src}
                    index={index}
                    style={{
                      height: itemHeight,
                      marginBottom: gap,
                    }}
                  />
                );
              }}
              onScroll={() => {
                state.isScrolling.current = true;
              }}
            />
          );
        }}
      </AutoSizer>
      <ScrollIndicator />
    </>
  );
};

export default FlipScroll;
