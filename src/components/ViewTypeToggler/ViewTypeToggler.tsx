import React, { useState } from 'react'
import styles from './ViewTypeToggler.module.less'

interface ViewTypeTogglerProps<T> {
  options: {
    label: React.ReactNode
    value: T
  }[]
  defaultValue?: T
  onClick: (value: T) => void
}

const ViewTypeToggler = <T,>(props: ViewTypeTogglerProps<T>) => {
  const { options, onClick, defaultValue } = props
  const [activeValue, setActiveValue] = useState<T | null>(defaultValue || null)

  return (
    <div className={styles.viewTypeTogglerContainer}>
      {options.map((item, index) => {
        return (
          <button
            className={
              activeValue !== null && activeValue === item.value
                ? styles.btnActive
                : ''
            }
            key={index}
            onClick={() => {
              setActiveValue(item.value)
              onClick(item.value)
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default ViewTypeToggler
