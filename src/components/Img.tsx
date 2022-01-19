import React from 'react'
import {
  Magnifier,
  MagnifierProps,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from 'react-image-magnifiers'

interface ImgProps extends MagnifierProps {}

const Img: React.FC<ImgProps> = (props) => {
  const { ...rest } = props

  return (
    <Magnifier
      mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
      touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
      dragToMove={false}
      {...rest}
    />
  )
}

export default Img
