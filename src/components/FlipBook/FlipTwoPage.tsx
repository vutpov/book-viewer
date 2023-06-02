import React, { useMemo, useEffect, useContext } from "react";
import styles from "./styles.module.less";
import lodash from "lodash";
import { getUUId, vitualizeArray } from "../../utils";
import Img from "../PinchZoomImg";
import usePrevious from "../../hooks/usePrevious";
import { FlipBookChildrenProps } from "./FlipBookChildren";
import { BookContext } from "../reducer";

const FlipTwoPage: React.FC<FlipBookChildrenProps> = (props) => {
  const { containerRef } = props;
  const state = useContext(BookContext);
  let src = state.src;

  const chunkedSrc = useMemo(() => {
    let sorted: any[] = [];
    for (let i = 0; i < src.length; i++) {
      if (i % 2 == 0) {
        sorted = [...sorted, src[i]];
      } else {
        sorted = [...sorted, src[i - 1]];
        sorted[i - 1] = src[i];
      }
    }

    sorted = sorted.map((item, index) => {
      return {
        src: item,
        index: index + 2,
      };
    });

    sorted = [
      {
        index: 0,
      },
      {
        index: 1,
      },
      ...sorted,
    ];

    return lodash.chunk(sorted, 2);
  }, [src]);

  const visibleChunkIndex = useMemo(() => {
    let beginIndex = state.currIndex;
    if (beginIndex % 2 !== 0) {
      beginIndex = beginIndex - 1;
    }

    return chunkedSrc.findIndex((item) => {
      let result: boolean =
        item[0].index == beginIndex || item[1].index == beginIndex + 1;

      return result;
    });
  }, [chunkedSrc, state.currIndex]);

  const vitualizedChunked = vitualizeArray({
    arr: chunkedSrc,
    from: visibleChunkIndex,
    padding: 2,
  });

  const compId = useMemo(() => {
    return getUUId();
  }, []);

  const oldIndex = usePrevious(state.currIndex);

  useEffect(() => {
    if (oldIndex !== state.currIndex && Number.isInteger(oldIndex)) {
      let prevPage = containerRef?.current?.querySelector(
        `#p-${oldIndex}-${compId}`
      );

      if (prevPage) {
        let target = prevPage.querySelector(".back");

        if (!target?.classList.contains("visible")) {
          return;
        }

        let clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("dblclick", true, true);
        target.dispatchEvent(clickEvent);
      }
    }
  }, [state.currIndex]);

  return (
    <React.Fragment>
      {vitualizedChunked.map((item) => {
        const backSrc = item.value[0]?.src;
        const frontSrc = item.value[1]?.src;
        const index = item.index;

        let zIndex: number;
        let flipStyle: React.CSSProperties = {};

        let styleBack: React.CSSProperties = {};
        let styleFront: React.CSSProperties = {};
        let isShown = index == visibleChunkIndex;
        if (isShown) {
          zIndex = chunkedSrc.length;

          flipStyle = {
            transform: `rotateY(-180deg)`,
          };

          styleFront = {
            pointerEvents: `none`,
          };
        } else {
          if (index > visibleChunkIndex) {
            zIndex = visibleChunkIndex + chunkedSrc.length - index;
          } else {
            flipStyle = {
              transform: `rotateY(-180deg)`,
            };
            zIndex = visibleChunkIndex - index - chunkedSrc.length;
          }
        }

        zIndex = Math.abs(zIndex);

        flipStyle = {
          ...flipStyle,
          zIndex,
        };

        // let backIndex = item.value[0]?.index;
        // let frontIndex = item.value[1]?.index;

        // let backPlaceholder = state.currIndex == backIndex;
        // let frontPlaceholder = state.currIndex + 1 == frontIndex;

        // console.log({
        //   item,
        //   currIndex: state.currIndex,
        //   backIndex,
        //   frontIndex,
        // });

        let backPlaceholder = false;
        let frontPlaceholder = false;

        return (
          <div
            className={styles.flip}
            key={index}
            style={flipStyle}
            id={`p-${index}-${compId}`}
          >
            {backSrc && (
              <div className={styles.back} style={styleBack}>
                <Img
                  imageSrc={backSrc}
                  className={"back"}
                  showPlaceholder={backPlaceholder}
                />
              </div>
            )}

            {frontSrc && (
              <div className={styles.front} style={styleFront}>
                <Img
                  imageSrc={frontSrc}
                  className={"front"}
                  showPlaceholder={frontPlaceholder}
                />
              </div>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default FlipTwoPage;
