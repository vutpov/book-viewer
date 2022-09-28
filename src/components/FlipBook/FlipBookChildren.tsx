//@ts-nocheck
import React, { useCallback } from 'react'
import { BookViewerState } from '../reducer'

interface FlipBookChildrenProps {
  state: BookViewerState
  src: string[]
  placeholder?: React.ReactNode
}

const FlipBookChildren: React.FC<FlipBookChildrenProps> = (props) => {
  const { state, src } = props

  const shouldShow = useCallback(
    (args: { index: number }) => {
      let beginIndex = state.currIndex
      let result: boolean
      const { index } = args

      if (state.viewType === 'onePage') {
        result = beginIndex === index
      } else if (state.viewType === 'twoPage') {
        let isFirstPage: boolean
        let isSecondPage: boolean
        if (beginIndex % 2 !== 0) {
          beginIndex = beginIndex - 1
        }

        isFirstPage = beginIndex == index
        isSecondPage = beginIndex + 1 == index

        result = Boolean(isFirstPage) || Boolean(isSecondPage)
      }

      return Boolean(result)
    },
    [state.currIndex, src, state.viewType]
  )

  return (
    <React.Fragment>
      {src.map((item, index) => {
        const visible = shouldShow({
          index
        })

        return (
          <img
            key={index}
            src={item}
            style={{
              display: visible ? 'block' : 'none'
            }}
          />
        )
      })}
    </React.Fragment>
  )
}

export default FlipBookChildren
