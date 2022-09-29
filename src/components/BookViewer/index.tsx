import React, { useState, useCallback, useReducer, useEffect } from 'react'
import PageNavigator from '../PageNavigator/PageNavigator'
import styles from './styles.module.less'
import Slider from '../Slider/Slider'
import PageNumber from '../PageNumber/PageNumber'
import { useTransition, animated } from 'react-spring'
import ViewTypeToggler from '../ViewTypeToggler/ViewTypeToggler'
import { usePrevious } from 'ahooks'
import { ActionType, defaultState, reducer, ViewType } from '../reducer'

interface props {
  src: string[]
  onChange?: (args: { oldIndex: number; newIndex: number }) => void
  containerClassName?: string
  containerRef?: React.RefObject<any> | null
  pageIndex?: number
  containerStyle?: React.CSSProperties
  transitionTimeout?: number
  suffixControl?: React.ReactNode
  prefixControl?: React.ReactNode
  placeholder?: React.ReactNode
  springOptions?: {
    immediate?: boolean
    [index: string]: any
  }
  [index: string]: any
}

const keyboardObj = {
  37: -1, //left
  39: 1 //right
}

const BookViewer: React.FC<props> = (props) => {
  const {
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
    ...rest
  } = props

  const [pageImageVisible, setPageImageVisible] = useState(true)
  const transitions = useTransition(pageImageVisible, null, {
    ...springOptions,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  useEffect(() => {
    if (pageIndex !== undefined) {
      const value = pageIndex - 1
      setPageNumberValue(value)
      dispatch({
        type: ActionType.changePage,
        payload: value
      })
    }
  }, [pageIndex])

  const [state, dispatch] = useReducer(reducer, defaultState)

  const [pageNumberValue, setPageNumberValue] = useState(state.currIndex)

  const changeIndex = useCallback(
    (indexToChange: number) => {
      const newIndex = state.currIndex + indexToChange
      setPageImageVisible(false)
      let newCurrIndex: number
      if (newIndex < 0) {
        newCurrIndex = 0
      } else if (newIndex >= src.length) {
        newCurrIndex = src.length - 1
      } else {
        newCurrIndex = newIndex
      }
      setPageNumberValue(newCurrIndex)

      setTimeout(() => {
        setPageImageVisible(true)
        dispatch({
          type: ActionType.changePage,
          payload: newCurrIndex
        })
      }, transitionTimeout)
    },
    [state.currIndex, src]
  )

  const oldIndex = usePrevious(state.currIndex)

  useEffect(() => {
    onChange &&
      onChange({
        oldIndex: oldIndex,
        newIndex: state.currIndex
      })
  }, [state.currIndex, oldIndex, onChange])

  const getPageViewerClasses = () => {
    return styles[state.viewType]
  }

  const renderImage = () => {
    let result: any
    let beginIndex = state.currIndex
    if (state.viewType === 'twoPage' && beginIndex % 2 !== 0) {
      beginIndex = beginIndex - 1
    }

    let firstSrc = beginIndex <= src.length - 1 ? src[beginIndex] : ''

    if (state.viewType === 'twoPage') {
      let secondSrc =
        beginIndex + 1 <= src.length - 1 ? src[beginIndex + 1] : null

      result = (
        <React.Fragment>
          {firstSrc ? <img src={firstSrc} /> : placeholder}
          {secondSrc ? <img src={secondSrc} /> : placeholder}
        </React.Fragment>
      )

      if (!firstSrc || typeof firstSrc !== 'string') {
        console.error(`Invalid image src: ${firstSrc}, ${secondSrc}`)
      }
    } else {
      result = (
        <React.Fragment>
          {' '}
          {firstSrc ? <img src={firstSrc} /> : placeholder}
        </React.Fragment>
      )

      if (!firstSrc || typeof firstSrc !== 'string') {
        console.error(`Invalid image src: ${firstSrc}`)
      }
    }

    return result
  }

  const containerClassName = pContainerClassName
    ? `${styles.container} ${pContainerClassName}`
    : styles.container

  return (
    <div
      {...rest}
      className={containerClassName}
      ref={(dom) => {
        if (pContainerRef) {
          //@ts-ignore
          pContainerRef!!.current = dom
        }
      }}
      style={containerStyle}
    >
      <div
        className={styles.dimContainer}
        onKeyDown={(e) => {
          const index = keyboardObj[e.keyCode]
          if (index) {
            changeIndex(keyboardObj[e.keyCode] * state.step)
          }
        }}
      >
        <div className={`page-viewer-container ${styles.pageViewerContainer}`}>
          {transitions.map(
            ({ item, key, props }: any) =>
              item && (
                <animated.div
                  className={getPageViewerClasses()}
                  key={key}
                  style={props}
                >
                  {renderImage()}
                </animated.div>
              )
          )}

          <PageNavigator
            onNextClick={() => {
              changeIndex(state.step)
            }}
            onPrevClick={() => {
              changeIndex(state.step * -1)
            }}
            className={styles.pageNavigator}
          />
        </div>
        <div />
        <div
          className={`page-control-container ${styles.pageViewerControlContainer}`}
        >
          <Slider
            min={0}
            value={pageNumberValue}
            max={src.length - 1}
            onChange={(value) => {
              setPageNumberValue(value)
              dispatch({
                type: ActionType.changePage,
                payload: value
              })
            }}
          />

          <div className={styles.pageViewerControlSubContainer}>
            {prefixControl}
            <PageNumber
              onChange={(value) => {
                let indexToChange
                try {
                  indexToChange = Number(value)
                } catch (e) {
                  indexToChange = state.currIndex
                  console.error(e)
                }

                if (!isNaN(indexToChange)) {
                  indexToChange = indexToChange - 1 - state.currIndex
                  changeIndex(indexToChange)
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
                  payload: value
                })
              }}
              options={[
                {
                  label: 'One Page',
                  value: ViewType.onePage
                },
                {
                  label: 'Two Page',
                  value: ViewType.twoPage
                }
              ]}
            />
            {suffixControl}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookViewer
