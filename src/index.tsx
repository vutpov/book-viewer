import React, { useState, useCallback } from 'react'
import PageNavigator from './components/PageNavigator'
import styles from './styles/styles.module.less'

interface props {
  src: string[]
}

export const BookViewer: React.FC<props> = (props) => {
  const { src } = props
  const [currIndex, setCurrIndex] = useState(0)

  const changeIndex = useCallback(
    (indexToChange: number) => {
      const newIndex = currIndex + indexToChange

      if (newIndex < 0) {
        console.log('first page')
      } else if (newIndex >= src.length) {
        console.log('last page')
      } else {
        setCurrIndex(newIndex)
      }
    },
    [currIndex, src]
  )

  const pageSrc = currIndex < src.length - 1 ? src[currIndex] : ''

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
      </div>
    </div>
  )
}
