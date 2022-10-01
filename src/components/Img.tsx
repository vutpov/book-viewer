//@ts-nocheck

import React, { useEffect, useState, useRef } from 'react'
import {
  Magnifier,
  MagnifierProps,
  MagnifierContainer,
  MagnifierPreview,
  MagnifierZoom,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from 'react-image-magnifiers'
import style from './Img.module.less'
interface ImgProps extends MagnifierProps {
  visible?: boolean
}

const Img: React.FC<ImgProps> = (props) => {
  const { visible: pVisible = true, className = '', ...rest } = props

  const [visible, setVisible] = useState(pVisible)

  useEffect(() => {
    setVisible(pVisible)
  }, [pVisible])

  const ref = useRef<HTMLDivElement>()

  let magnifierClassName = `magifier ${style.bookMagnifier} ${className}`

  if (visible) {
    magnifierClassName = `${magnifierClassName} ${style.visible}`
  }

  return (
    <div
      ref={ref}
      onDoubleClick={() => {
        const child = ref.current?.firstElementChild

        child?.classList.toggle('zoom')
      }}
    >
      <Magnifier
        onImageLoad={() => {
          setVisible(true)
        }}
        mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
        touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
        dragToMove={true}
        {...rest}
        className={magnifierClassName}
      />
    </div>
  )
}

export default Img
