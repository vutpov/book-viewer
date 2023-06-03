import { useDebounceFn } from "ahooks";
import React, { useEffect, useReducer } from "react";

const viewTypeObj = {
  onePage: 1,
  twoPage: 2,
};

export enum ViewType {
  "onePage" = "onePage",
  "twoPage" = "twoPage",
  "scroll" = "scroll",
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
  scrollToItem: boolean;
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
      let newCurrIndex =
        typeof action.payload === "number"
          ? action.payload
          : action.payload.index;

      let scrollToItem =
        typeof action.payload === "number" ? true : action.payload.scrollToItem;

      return {
        ...state,
        currIndex: newCurrIndex,
        scrollToItem,
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
  scrollToItem: false,
};

interface BookContextAddOns {
  dispatch: React.Dispatch<{
    type: ActionType;
    payload: any;
  }>;
  changeIndex: (
    args:
      | number
      | {
          index: number;
          scrollToItem?: boolean | undefined;
        }
  ) => void;
  isScrolling: React.MutableRefObject<boolean>;
}

export const BookContext = React.createContext<
  BookViewerState & BookContextAddOns
>(defaultState as any);

export const BookProvider: React.FC<
  React.PropsWithChildren<Partial<BookViewerState>>
> = (props) => {
  const isScrolling = React.useRef(false);

  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...props,
    currIndex: props.currIndex || 0,
  });

  useEffect(() => {
    dispatch({
      type: ActionType.changeSrc,
      payload: props.src,
    });
  }, [props.src]);

  useEffect(() => {
    if (props.currIndex === undefined) return;

    dispatch({
      type: ActionType.changePage,
      payload: props.currIndex,
    });
  }, [props.currIndex]);

  const { run: changeIndex } = useDebounceFn(
    (args: Parameters<BookContextAddOns["changeIndex"]>[0]) => {
      let argsIndex = typeof args === "number" ? args : args.index;
      let scrollToItem = typeof args === "number" ? true : args.scrollToItem;
      const newIndex = state.currIndex + argsIndex;

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
        payload: {
          index: newCurrIndex,
          scrollToItem,
        },
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
        isScrolling,
      }}
    >
      {props.children}
    </BookContext.Provider>
  );
};
