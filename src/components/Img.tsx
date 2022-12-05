import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Magnifier,
  MagnifierProps,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from 'react-image-magnifiers'
import style from './Img.module.less'
import { ActionType, BookContext } from './reducer'
interface ImgProps extends MagnifierProps {
  visible?: boolean
}

const Img: React.FC<ImgProps> = (props) => {
  const { visible: pVisible = true, className = '', ...rest } = props

  const [visible, setVisible] = useState(pVisible)
  const { dispatch } = useContext(BookContext)
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
      //@ts-ignore
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
        onZoomStart={() => {
          dispatch({
            type: ActionType.changeZoom,
            payload: props.imageSrc
          })
        }}
        onZoomEnd={() => {
          dispatch({
            type: ActionType.changeZoom,
            payload: undefined
          })
        }}
        {...rest}
        className={magnifierClassName}
      />
    </div>
  )
}

export default Img
