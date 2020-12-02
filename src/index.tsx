import React, { useState, useCallback } from 'react'
import PageNavigator from './components/PageNavigator'
import styles from './styles/styles.module.less'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import PageNumber from './components/PageNumber'

interface props {
  src: string[]
}

export const BookViewer: React.FC<props> = (props) => {
  const { src } = props
  const [currIndex, setCurrIndex] = useState(0)

  const changeIndex = useCallback(
    (indexToChange: number) => {
      const newIndex = currIndex + indexToChange

      let newCurrIndex: number
      if (newIndex < 0) {
        newCurrIndex = 0
      } else if (newIndex >= src.length) {
        newCurrIndex = src.length - 1
      } else {
        newCurrIndex = newIndex
      }

      setCurrIndex(newCurrIndex)
    },
    [currIndex, src]
  )

  const pageSrc = currIndex <= src.length - 1 ? src[currIndex] : ''

  return (
    <div className={styles.container}>
      <div className={styles.dimContainer}>
        <div className={styles.pageViewerContainer}>
          <img className={styles.pageViewer} src={pageSrc} />

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
            value={currIndex}
            max={src.length - 1}
            onChange={(value) => {
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
            value={currIndex}
            max={src.length}
            className={styles.pageNumber}
          />
        </div>
      </div>
    </div>
  )
}
