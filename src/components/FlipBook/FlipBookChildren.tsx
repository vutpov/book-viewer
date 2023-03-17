//@ts-nocheck
import React, { useMemo, useEffect } from 'react'
import { BookViewerState } from '../reducer'
import styles from './styles.module.less'
import lodash from 'lodash'
import { getUUId, vitualizeArray } from '../../utils'
import Img from '../PinchZoomImg'
import usePrevious from '../../hooks/usePrevious'

interface FlipBookChildrenProps {
  state: BookViewerState
  src: string[]
  placeholder?: React.ReactNode
  containerRef?: React.MutableRefObject<HTMLDivElement | undefined>
}

const FlipOnePage: React.FC<FlipBookChildrenProps> = (props) => {
  const { state, src } = props

  let beginIndex = state.currIndex

  return (
    <React.Fragment>
      <Img imageSrc={src[beginIndex]} />
    </React.Fragment>
  )
}

const FlipTwoPage: React.FC<FlipBookChildrenProps> = (props) => {
  const { src, state, containerRef } = props

  const chunkedSrc = useMemo(() => {
    let sorted = []
    for (let i = 0; i < src.length; i++) {
      if (i % 2 == 0) {
        sorted = [...sorted, src[i]]
      } else {
        sorted = [...sorted, src[i - 1]]
        sorted[i - 1] = src[i]
      }
    }

    sorted = sorted.map((item, index) => {
      return {
        src: item,
        index: index + 2
      }
    })

    sorted = [
      {
        index: 0
      },
      {
        index: 1
      },
      ...sorted
    ]

    console.log(sorted, `hello`)

    return lodash.chunk(sorted, 2)
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
    padding: 2
  })

  const compId = useMemo(() => {
    return getUUId()
  }, [])

  const oldIndex = usePrevious(state.currIndex)

  useEffect(() => {
    if (oldIndex !== state.currIndex && Number.isInteger(oldIndex)) {
      let prevPage = containerRef?.current?.querySelector(
        `#p-${oldIndex}-${compId}`
      )

      if (prevPage) {
        let target = prevPage.querySelector('.back')

        if (!target?.classList.contains('visible')) {
          return
        }

        let clickEvent = document.createEvent('MouseEvents')
        clickEvent.initEvent('dblclick', true, true)
        target.dispatchEvent(clickEvent)
      }
    }
  }, [state.currIndex])

  return (
    <React.Fragment>
      {vitualizedChunked.map((item) => {
        const backSrc = item.value[0]?.src
        const frontSrc = item.value[1]?.src
        const index = item.index

        let zIndex: number
        let flipStyle: React.CSSProperties = {}

        let styleBack: React.CSSProperties = {}
        let styleFront: React.CSSProperties = {}

        if (index == visibleChunkIndex) {
          zIndex = chunkedSrc.length

          flipStyle = {
            transform: `rotateY(-180deg)`
          }

          styleFront = {
            pointerEvents: `none`
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
          <div
            className={styles.flip}
            key={index}
            style={flipStyle}
            id={`p-${index}-${compId}`}
          >
            {backSrc && (
              <div className={styles.back} style={styleBack}>
                <Img imageSrc={backSrc} visible={false} className={'back'} />
              </div>
            )}

            {frontSrc && (
              <div className={styles.front} style={styleFront}>
                <Img imageSrc={frontSrc} visible={false} className={'front'} />
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

  let children =
    state.viewType === 'onePage' ? (
      <FlipOnePage {...props} />
    ) : (
      <FlipTwoPage {...props} />
    )

  return children
}

export default FlipBookChildren
