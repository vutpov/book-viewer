import React from 'react'
import styles from './PageNumber.module.less'

interface PageNumberProps {
  value: number
  className?: string
  onChange: (value: string) => void
  max?: number
}

const PageNumber: React.FC<PageNumberProps> = (props) => {
  const { value, className = '', onChange, max = 0 } = props

  const valueToShow = value + 1

  return (
    <div className={`${styles.pageNumberContainer} ${className}`}>
      <input
        type={'number'}
        className={styles.pageNumberInput}
        value={valueToShow}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
      <div className={styles.pageNumberItemSuffix}>
        <div className={styles.seperator}>/</div>
        <div>{max}</div>
      </div>
    </div>
  )
}

export default PageNumber
