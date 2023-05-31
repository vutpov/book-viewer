import { useContext, useEffect, useState } from "react";
import Slider from "../Slider/Slider";
import styles from "./styles.module.less";
import { ActionType, BookContext, ViewType } from "../reducer";
import PageNumber from "../PageNumber/PageNumber";
import ViewTypeToggler from "../ViewTypeToggler/ViewTypeToggler";
import { useDebounceEffect } from "ahooks";

interface PageControlProps {
  suffixControl?: React.ReactNode;
  prefixControl?: React.ReactNode;
  viewTypeTogglerLabels?: [React.ReactNode, React.ReactNode];
}

const PageControl: React.FC<PageControlProps> = (props) => {
  const {
    prefixControl,
    suffixControl,
    viewTypeTogglerLabels = ["One Page", "Two Page"],
  } = props;
  const { dispatch, src, changeIndex, ...state } = useContext(BookContext);
  const [pageNumberValue, setPageNumberValue] = useState(state.currIndex || 0);

  useDebounceEffect(
    () => {
      dispatch({
        type: ActionType.changePage,
        payload: pageNumberValue,
      });
    },
    [pageNumberValue],
    {
      wait: 90,
    }
  );

  useEffect(() => {
    setPageNumberValue(state.currIndex);
  }, [state.currIndex]);

  let pageControl = (
    <div
      className={`page-control-container ${styles.pageViewerControlContainer}`}
    >
      <Slider
        min={0}
        max={src.length - 1}
        value={pageNumberValue}
        onChange={(value) => {
          setPageNumberValue(Number(value));
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

  return pageControl;
};

export default PageControl;
