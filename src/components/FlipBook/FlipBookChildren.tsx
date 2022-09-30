import React, { useMemo } from 'react'
import { BookViewerState } from '../reducer'
import styles from './styles.module.less'
import lodash from 'lodash'
import { vitualizeArray } from '../../utils'

interface FlipBookChildrenProps {
  state: BookViewerState
  src: string[]
  placeholder?: React.ReactNode
}

const FlipOnePage: React.FC<FlipBookChildrenProps> = (props) => {
  const { state, src } = props

  let beginIndex = state.currIndex

  return (
    <React.Fragment>
      <img src={src[beginIndex]} />
    </React.Fragment>
  )
}

const FlipTwoPage: React.FC<FlipBookChildrenProps> = (props) => {
  const { src, state } = props

  const chunkedSrc = useMemo(() => {
    let result = src.map((item, index) => {
      return {
        src: item,
        index
      }
    })

    return lodash.chunk(result, 2)
  }, [src])

  const visibleChunkIndex = useMemo(() => {
    let beginIndex = state.currIndex
    if (beginIndex % 2 !== 0) {
      beginIndex = beginIndex - 1
    }

    return chunkedSrc.findIndex((item) => {
      let result: boolean =
        item[0].index == beginIndex || item[1].index == beginIndex + 1

      return result
    })
  }, [chunkedSrc, state.currIndex])

  const vitualizedChunked = vitualizeArray({
    arr: chunkedSrc,
    from: visibleChunkIndex,
    padding: 5
  })

  return (
    <React.Fragment>
      {vitualizedChunked.map((item) => {
        const backSrc = item.value[1]?.src
        const frontSrc = item.value[0]?.src
        const index = item.index

        let zIndex: number
        let flipStyle: React.CSSProperties = {}

        if (index == visibleChunkIndex) {
          zIndex = chunkedSrc.length
          flipStyle = {
            transform: `rotateY(-180deg)`
          }
        } else {
          if (index > visibleChunkIndex) {
            zIndex = visibleChunkIndex + chunkedSrc.length - index
          } else {
            flipStyle = {
              transform: `rotateY(-180deg)`
            }
            zIndex = visibleChunkIndex - index - chunkedSrc.length
          }
        }

        zIndex = Math.abs(zIndex)

        flipStyle = {
          ...flipStyle,
          zIndex
        }

        return (
          <div className={styles.flip} key={index} style={flipStyle}>
            {backSrc && (
              <div className={styles.back}>
                <img src={backSrc} />
              </div>
            )}

            {frontSrc && (
              <div className={styles.front}>
                <img src={frontSrc} />
              </div>
            )}
          </div>
        )
      })}
    </React.Fragment>
  )
}

const FlipBookChildren: React.FC<FlipBookChildrenProps> = (props) => {
  const { state } = props

  if (state.viewType === 'onePage') {
    return <FlipOnePage {...props} />
  }

  return (
    <React.Fragment>
      <FlipTwoPage {...props} />
    </React.Fragment>
  )
}

export default FlipBookChildren
