//@ts-nocheck

import React, { useEffect, useState } from 'react'
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

  let magnifierClassName = `${style.bookMagnifier} ${className}`

  if (visible) {
    magnifierClassName = `${magnifierClassName} ${style.visible}`
  }

  return (
    <Magnifier
      onImageLoad={() => {
        setVisible(true)
      }}
      mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
      touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
      dragToMove={false}
      {...rest}
      className={magnifierClassName}
    />
  )
}

export default Img
