import React, { useRef, useCallback, useContext } from "react";
import QuickPinchZoom, {
  make3dTransformValue,
  UpdateAction,
} from "react-quick-pinch-zoom";
import { BookContext } from "./reducer";
import { ActionType } from "./reducer";
import { roundNumber } from "../utils";

interface ImgProps {
  imageSrc?: string;
  [index: string]: any;
}

const maxScale = 3;

const Img: React.FC<ImgProps> = (props) => {
  const {} = props;

  const imgRef = useRef<HTMLImageElement>();
  const zoomRef = useRef<QuickPinchZoom>();
  const { dispatch } = useContext(BookContext);
  let scaleRef = useRef(0);
  const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
    const { current: img } = imgRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      img.style.setProperty("transform", value);
    }

    scaleRef.current = roundNumber(scale);
  }, []);

  return (
    <>
      <QuickPinchZoom
        //@ts-ignore
        ref={zoomRef}
        onUpdate={onUpdate}
        maxZoom={maxScale}
        doubleTapZoomOutOnMaxScale={true}
        zoomOutFactor={1}
        // onZoomEnd={() => {
        //   let zoomSrc = scaleRef.current == 1 ? null : props.imageSrc;

        //   dispatch({
        //     type: ActionType.changeZoom,
        //     payload: zoomSrc,
        //   });
        // }}

        onZoomUpdate={() => {
          let zoomSrc = scaleRef.current == 1 ? null : props.imageSrc;

          dispatch({
            type: ActionType.changeZoom,
            payload: zoomSrc,
          });
        }}
      >
        {/* @ts-ignore */}
        <img src={props.imageSrc} ref={imgRef} />
      </QuickPinchZoom>
    </>
  );
};

export default Img;
