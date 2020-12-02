import React, { useState, useCallback } from 'react'
import PageNavigator from './components/PageNavigator'
import styles from './styles/styles.module.less'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import PageNumber from './components/PageNumber'
//@ts-ignore
import { useTransition, animated } from 'react-spring'

interface props {
  src: string[]
}

export const BookViewer: React.FC<props> = (props) => {
  const { src } = props
  const [currIndex, setCurrIndex] = useState(0)

  const [pageImageVisible, setPageImageVisible] = useState(true)
  const transitions = useTransition(pageImageVisible, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const [pageNumberValue, setPageNumberValue] = useState(currIndex)

  const changeIndex = useCallback(
    (indexToChange: number) => {
      const newIndex = currIndex + indexToChange
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
        setCurrIndex(newCurrIndex)
      }, 800)
    },
    [currIndex, src]
  )

  const pageSrc = currIndex <= src.length - 1 ? src[currIndex] : ''

  return (
    <div className={styles.container}>
      <div className={styles.dimContainer}>
        <div className={styles.pageViewerContainer}>
          {transitions.map(
            ({ item, key, props }: any) =>
              item && (
                <animated.img
                  className={styles.pageViewer}
                  key={key}
                  style={props}
                  src={pageSrc}
                />
              )
          )}
          <img />

          <PageNavigator
            onNextClick={() => {
              changeIndex(1)
            }}
            onPrevClick={() => {
              changeIndex(-1)
            }}
            className={styles.pageNavigator}
          />
        </div>
        <div />
        <div className={styles.pageViewerControlContainer}>
          <Slider
            min={0}
            value={pageNumberValue}
            max={src.length - 1}
            onChange={(value) => {
              setPageNumberValue(value)
              setCurrIndex(value)
            }}
          />

          <PageNumber
            onChange={(value) => {
              let indexToChange = Number(value)

              if (!isNaN(indexToChange)) {
                indexToChange = indexToChange - 1 - currIndex
                changeIndex(indexToChange)
              }
            }}
            value={pageNumberValue}
            max={src.length}
            className={styles.pageNumber}
          />
        </div>
      </div>
    </div>
  )
}
