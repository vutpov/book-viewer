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
  'changeViewType' = 'changeViewType'
}

export interface BookViewerState {
  currIndex: number
  step: number
  viewType: ViewType
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
    default:
      return state
  }
}

export const defaultState: BookViewerState = {
  currIndex: 0,
  step: 1,
  viewType: ViewType.onePage
}
