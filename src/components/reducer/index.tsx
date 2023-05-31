import { useThrottleFn } from "ahooks";
import { DebouncedFunc } from "lodash";
import React, { useEffect, useReducer } from "react";

const viewTypeObj = {
  onePage: 1,
  twoPage: 2,
};

export enum ViewType {
  "onePage" = "onePage",
  "twoPage" = "twoPage",
}

export enum ActionType {
  "changePage" = "changePage",
  "changeViewType" = "changeViewType",
  "changeZoom" = "changeZoom",
  "changeSrc" = "changeSrc",
}

export interface BookViewerState {
  currIndex: number;
  step: number;
  viewType: ViewType;
  zoomSrc?: string;
  src: string[];
}

export const reducer = (
  state: BookViewerState,
  action: {
    type: ActionType;
    payload: any;
  }
) => {
  switch (action.type) {
    case ActionType.changePage:
      return {
        ...state,
        currIndex: action.payload,
      };
    case ActionType.changeViewType:
      return {
        ...state,
        viewType: action.payload,
        //@ts-ignore
        step: viewTypeObj[action.payload],
      };
    case ActionType.changeZoom:
      return {
        ...state,
        zoomSrc: action.payload,
      };
    case ActionType.changeSrc:
      return {
        ...state,
        src: action.payload,
      };
    default:
      return state;
  }
};

export const defaultState: BookViewerState = {
  currIndex: 0,
  step: 1,
  viewType: ViewType.onePage,
  src: [],
};

interface BookContextAddOns {
  dispatch: React.Dispatch<{
    type: ActionType;
    payload: any;
  }>;
  changeIndex: DebouncedFunc<(indexToChange: number) => void>;
}

export const BookContext = React.createContext<
  BookViewerState & BookContextAddOns
>(defaultState as any);

export const BookProvider: React.FC<
  React.PropsWithChildren<Partial<BookViewerState>>
> = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...props,
  });

  useEffect(() => {
    dispatch({
      type: ActionType.changeSrc,
      payload: props.src,
    });
  }, [props.src]);

  const { run: changeIndex } = useThrottleFn(
    (indexToChange: number) => {
      const newIndex = state.currIndex + indexToChange;

      let newCurrIndex: number;
      if (newIndex < 0) {
        newCurrIndex = 0;
      } else if (newIndex >= state.src.length) {
        newCurrIndex = state.src.length - 1;
      } else {
        newCurrIndex = newIndex;
      }

      dispatch({
        type: ActionType.changePage,
        payload: newCurrIndex,
      });
    },
    {
      wait: 500,
    }
  );

  return (
    <BookContext.Provider
      value={{
        ...state,
        dispatch,
        changeIndex,
      }}
    >
      {props.children}
    </BookContext.Provider>
  );
};
