import React, { useEffect, useRef, useContext } from "react";
import PageNavigator from "../PageNavigator/PageNavigator";
import styles from "./styles.module.less";
import { usePrevious } from "ahooks";
import { BookContext } from "../reducer";
import FlipBookChildren from "./FlipBookChildren";
import PageControl from "./PageControl";

interface props {
  onChange?: (args: { oldIndex?: number; newIndex: number }) => void;
  containerClassName?: string;
  containerRef?: React.RefObject<any> | null;
  containerStyle?: React.CSSProperties;
  transitionTimeout?: number;
  suffixControl?: React.ReactNode;
  prefixControl?: React.ReactNode;
  placeholder?: React.ReactNode;
  springOptions?: {
    immediate?: boolean;
    [index: string]: any;
  };
  pageIndex?: number;
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

  const { dispatch, src, changeIndex, ...state } = useContext(BookContext);

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

  let touchstartX = useRef(0);
  let touchendX = useRef(0);
  let multiTouches = useRef(false);

  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchstartX.current = e.changedTouches[0].screenX;

    multiTouches.current = e.touches.length > 1;
  };

  function checkDirection() {
    let shouldSwipe = !state.zoomSrc;

    if (!shouldSwipe) {
      return;
    }

    const swipeLeft = () => {
      changeIndex(state.step);
    };

    const swipeRight = () => {
      changeIndex(state.step * -1);
    };

    const threshold = 70;
    const swipeDistance = Math.abs(touchstartX.current - touchendX.current);
    const isSwipe = swipeDistance >= threshold;

    if (!isSwipe) {
      return;
    }

    if (touchendX.current < touchstartX.current) {
      swipeLeft();
    } else if (touchendX.current > touchstartX.current) {
      swipeRight();
    }
  }

  const touched = (e: React.TouchEvent<HTMLDivElement>) => {
    touchendX.current = e.changedTouches[0].screenX;

    if (!multiTouches.current) {
      checkDirection();
    }
  };

  let pageControl = (
    <PageControl
      suffixControl={suffixControl}
      prefixControl={prefixControl}
      viewTypeTogglerLabels={viewTypeTogglerLabels}
    />
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
          <div
            className={`${getPageViewerClasses()}`}
            // ref={pageViewerRef as any}
            onTouchStart={(e) => {
              touchStart(e);
            }}
            onTouchEnd={(e) => {
              touched(e);
            }}
          >
            <FlipBookChildren
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
