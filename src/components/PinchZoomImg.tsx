//@ts-nocheck
import React, { useRef, useCallback } from 'react'
import QuickPinchZoom, {
  make3dTransformValue,
  UpdateAction
} from 'react-quick-pinch-zoom'

interface ImgProps {
  imageSrc?: string
}

const maxScale = 3

const Img: React.FC<ImgProps> = (props) => {
  const {} = props

  const imgRef = useRef<HTMLImageElement>()
  const zoomRef = useRef<QuickPinchZoom>()

  const currentScale = useRef(1)

  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: img } = imgRef

    if (img) {
      const value = make3dTransformValue({ x, y, scale })

      img.style.setProperty('transform', value)
    }
  }, [])

  return (
    <QuickPinchZoom
      ref={zoomRef}
      onUpdate={onUpdate}
      maxZoom={maxScale}
      doubleTapZoomOutOnMaxScale={true}
      zoomOutFactor={1}
    >
      {/* @ts-ignore */}
      <img src={props.imageSrc} ref={imgRef} />
    </QuickPinchZoom>
  )
}

export default Img
