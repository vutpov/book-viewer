import React, { useEffect } from 'react'
import styles from './PageNavigator.module.less'
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'

interface PageNavigatorProps {
  onNextClick: () => void
  onPrevClick: () => void
  className: string
}

const btnNextId = '__book-viewer-btn-next'

const PageNavigator: React.FC<PageNavigatorProps> = (props) => {
  const { onNextClick, onPrevClick, className } = props

  useEffect(() => {
    const dom = document.getElementById(btnNextId)
    dom!!.focus()
  }, [])

  return (
    <div className={`${styles.pageNavigatorContainer} ${className}`}>
      <button
        className={styles.pageNavBtn}
        onClick={() => {
          onPrevClick()
        }}
      >
        <FaArrowLeft className={styles.icon} />
      </button>
      <button
        id={btnNextId}
        className={styles.pageNavBtn}
        onClick={() => {
          onNextClick()
        }}
      >
        <FaArrowRight className={styles.icon} />
      </button>
    </div>
  )
}

export default PageNavigator
