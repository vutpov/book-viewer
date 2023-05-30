import React, { useState, useEffect, useRef, useContext } from "react";
import PageNavigator from "../PageNavigator/PageNavigator";
import styles from "./styles.module.less";
import Slider from "../Slider/Slider";
import PageNumber from "../PageNumber/PageNumber";
import ViewTypeToggler from "../ViewTypeToggler/ViewTypeToggler";
import { usePrevious } from "ahooks";
import { ActionType, BookContext, ViewType } from "../reducer";
import FlipBookChildren from "./FlipBookChildren";
import { useThrottleFn, useDebounceEffect } from "ahooks";

interface props {
  src: string[];
  onChange?: (args: { oldIndex?: number; newIndex: number }) => void;
  containerClassName?: string;
  containerRef?: React.RefObject<any> | null;
  pageIndex?: number;
  containerStyle?: React.CSSProperties;
  transitionTimeout?: number;
  suffixControl?: React.ReactNode;
  prefixControl?: React.ReactNode;
  placeholder?: React.ReactNode;
  springOptions?: {
    immediate?: boolean;
    [index: string]: any;
  };
  viewTypeTogglerLabels?: [React.ReactNode, React.ReactNode];
  renderPageControl?: (pageControl: React.ReactNode) => React.ReactNode;
  [index: string]: any;
}

const keyboardObj = {
  37: -1, //key left
  39: 1, //right
};

const FlipBook: React.FC<props> = (props) => {
  let {
    src,
    onChange,
    containerClassName: pContainerClassName,
    containerRef: pContainerRef,
    pageIndex,
    containerStyle,
    transitionTimeout = 800,
    springOptions,
    suffixControl,
    prefixControl,
    placeholder,
    viewTypeTogglerLabels = ["One Page", "Two Page"],
    renderPageControl,
    ...rest
  } = props;

  useEffect(() => {
    if (pageIndex !== undefined) {
      const value = pageIndex - 1;
      setPageNumberValue(value);
      dispatch({
        type: ActionType.changePage,
        payload: value,
      });
    }
  }, [pageIndex]);

  const { dispatch, ...state } = useContext(BookContext);

  const [pageNumberValue, setPageNumberValue] = useState(state.currIndex);

  const { run: changeIndex } = useThrottleFn(
    (indexToChange: number) => {
      const newIndex = state.currIndex + indexToChange;

      let newCurrIndex: number;
      if (newIndex < 0) {
        newCurrIndex = 0;
      } else if (newIndex >= src.length) {
        newCurrIndex = src.length - 1;
      } else {
        newCurrIndex = newIndex;
      }
      setPageNumberValue(newCurrIndex);

      dispatch({
        type: ActionType.changePage,
        payload: newCurrIndex,
      });
    },
    {
      wait: 500,
    }
  );

  const { run: sliderChange } = useThrottleFn(
    (value: number) => {
      setPageNumberValue(value);
      dispatch({
        type: ActionType.changePage,
        payload: value,
      });
    },
    {
      wait: 500,
    }
  );

  const oldIndex = usePrevious(state.currIndex);

  useEffect(() => {
    onChange &&
      onChange({
        oldIndex: oldIndex,
        newIndex: state.currIndex,
      });
  }, [state.currIndex, oldIndex, onChange]);

  const getPageViewerClasses = () => {
    return styles[state.viewType];
  };

  const containerClassName = pContainerClassName
    ? `${styles.container} ${pContainerClassName}`
    : styles.container;

  const pageViewerRef = useRef<HTMLDivElement>();

  useDebounceEffect(
    () => {
      let touchstartX = 0;
      let touchendX = 0;

      const swipeLeft = () => {
        changeIndex(state.step);
      };

      const swipeRight = () => {
        changeIndex(state.step * -1);
      };

      function checkDirection() {
        let shouldSwipe = !state.zoomSrc;

        if (!shouldSwipe) {
          return;
        }

        const threshold = 70;
        const swipeDistance = Math.abs(touchstartX - touchendX);
        const isSwipe = swipeDistance >= threshold;

        if (!isSwipe) {
          return;
        }

        if (touchendX < touchstartX) {
          swipeLeft();
        } else if (touchendX > touchstartX) {
          swipeRight();
        }
      }

      const touchStart = (e: any) => {
        touchstartX = e.changedTouches[0].screenX;
      };

      const touched = (e: any) => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection();
      };

      if (!pageViewerRef.current) {
        return;
      }

      pageViewerRef.current.addEventListener("touchstart", touchStart);

      pageViewerRef.current.addEventListener("touchend", touched);

      return () => {
        if (!pageViewerRef.current) {
          return;
        }
        pageViewerRef.current.removeEventListener("touchstart", touchStart);
        pageViewerRef.current.removeEventListener("touchend", touched);
      };
    },
    [state.step, state.zoomSrc],
    {
      wait: 90,
    }
  );

  let pageControl = (
    <div
      className={`page-control-container ${styles.pageViewerControlContainer}`}
    >
      <Slider
        min={0}
        value={pageNumberValue}
        max={src.length - 1}
        onChange={(value) => {
          sliderChange(value as number);
        }}
      />

      <div className={styles.pageViewerControlSubContainer}>
        {prefixControl}
        <PageNumber
          onChange={(value) => {
            let indexToChange;
            try {
              indexToChange = Number(value);
            } catch (e) {
              indexToChange = state.currIndex;
              console.error(e);
            }

            if (!isNaN(indexToChange)) {
              indexToChange = indexToChange - 1 - state.currIndex;
              changeIndex(indexToChange);
            }
          }}
          step={state.step}
          value={pageNumberValue}
          max={src.length}
          className={styles.pageNumber}
        />

        <ViewTypeToggler<ViewType>
          onClick={(value) => {
            dispatch({
              type: ActionType.changeViewType,
              payload: value,
            });
          }}
          options={[
            {
              label: viewTypeTogglerLabels[0],
              value: ViewType.onePage,
            },
            {
              label: viewTypeTogglerLabels[1],
              value: ViewType.twoPage,
            },
          ]}
        />
        {suffixControl}
      </div>
    </div>
  );

  if (!renderPageControl) {
    renderPageControl = (pageControl) => {
      return pageControl;
    };
  }

  // const { zoomSrc } = useContext(BookContext)

  return (
    <div
      {...rest}
      className={containerClassName}
      ref={(dom) => {
        if (pContainerRef) {
          //@ts-ignore
          pContainerRef!!.current = dom;
        }
      }}
      style={containerStyle}
    >
      <div
        className={styles.dimContainer}
        onKeyDown={(e) => {
          //@ts-ignore
          const index = keyboardObj[e.keyCode];
          if (index) {
            changeIndex(index * state.step);
          }
        }}
      >
        <div className={`page-viewer-container ${styles.pageViewerContainer}`}>
          {/* <div>hello {zoomSrc}</div> */}

          {/* @ts-ignore */}
          <div className={`${getPageViewerClasses()}`} ref={pageViewerRef}>
            <FlipBookChildren
              src={src}
              state={state}
              placeholder={placeholder}
              containerRef={pageViewerRef}
            />
          </div>

          <PageNavigator
            onNextClick={() => {
              changeIndex(state.step);
            }}
            onPrevClick={() => {
              changeIndex(state.step * -1);
            }}
            className={styles.pageNavigator}
          />
        </div>
        <div />
        {renderPageControl(pageControl)}
      </div>
    </div>
  );
};

export default FlipBook;
