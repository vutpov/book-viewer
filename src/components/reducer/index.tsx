import React, { useReducer } from 'react'

const viewTypeObj = {
  onePage: 1,
  twoPage: 2
}

export enum ViewType {
  'onePage' = 'onePage',
  'twoPage' = 'twoPage'
}

export enum ActionType {
  'changePage' = 'changePage',
  'changeViewType' = 'changeViewType',
  'changeZoom' = 'changeZoom'
}

export interface BookViewerState {
  currIndex: number
  step: number
  viewType: ViewType
  zoomSrc?: string
}

export const reducer = (
  state: BookViewerState,
  action: {
    type: ActionType
    payload: any
  }
) => {
  switch (action.type) {
    case ActionType.changePage:
      return {
        ...state,
        currIndex: action.payload
      }
    case ActionType.changeViewType:
      return {
        ...state,
        viewType: action.payload,
        step: viewTypeObj[action.payload]
      }
    case ActionType.changeZoom:
      return {
        ...state,
        zoomSrc: action.payload
      }
    default:
      return state
  }
}

export const defaultState: BookViewerState = {
  currIndex: 0,
  step: 1,
  viewType: ViewType.onePage
}

interface BookContextAddOns {
  dispatch: React.Dispatch<{
    type: ActionType
    payload: any
  }>
}

export const BookContext = React.createContext<
  BookViewerState & BookContextAddOns
>(defaultState as any)

export const BookProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <BookContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {props.children}
    </BookContext.Provider>
  )
}
