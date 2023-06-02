//@ts-nocheck
import React, { useRef, useCallback, useContext } from "react";
import QuickPinchZoom, {
  make3dTransformValue,
  UpdateAction,
} from "react-quick-pinch-zoom";
import { BookContext } from "./reducer";
import { ActionType } from "./reducer";
import { roundNumber } from "../utils";
import { useImage } from "react-image";
import CoolImg from "react-cool-img";

interface ImgProps {
  imageSrc?: string;
  showPlaceholder?: boolean;
  [index: string]: any;
}

const maxScale = 3;

const Img: React.FC<ImgProps> = (props) => {
  const { style, showPlaceholder = true } = props;

  const imgRef = useRef<HTMLImageElement>();
  const zoomRef = useRef<QuickPinchZoom>();
  const { dispatch } = useContext(BookContext);
  let scaleRef = useRef(0);
  const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
    const { current: img } = imgRef as any;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      img.style.setProperty("transform", value);
    }

    scaleRef.current = roundNumber(scale);
  }, []);

  const { src, isLoading, error } = useImage({
    srcList: [props.imageSrc],
    useSuspense: false,
  });

  const renderImg = () => {
    let imgProps: any = {
      ref: imgRef,
    };

    let result = <img {...imgProps} src={src} style={style} />;

    if (!showPlaceholder) {
      return result;
    }

    let placeholderStyle = {};

    if (isLoading) {
      return (
        <img
          {...imgProps}
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          style={{
            ...style,
            ...placeholderStyle,
          }}
        />
      );
    }

    if (error) {
      return (
        <img
          {...imgProps}
          src={`https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg`}
          style={{
            ...style,
            ...placeholderStyle,
          }}
        />
      );
    }

    return result;
  };

  return (
    <>
      <QuickPinchZoom
        ref={zoomRef}
        onUpdate={onUpdate}
        maxZoom={maxScale}
        doubleTapZoomOutOnMaxScale={true}
        zoomOutFactor={1}
        onZoomEnd={() => {
          let zoomSrc = scaleRef.current == 1 ? null : props.imageSrc;

          dispatch({
            type: ActionType.changeZoom,
            payload: zoomSrc,
          });
        }}

        // onZoomUpdate={() => {
        //   let zoomSrc = scaleRef.current == 1 ? null : props.imageSrc;

        //   dispatch({
        //     type: ActionType.changeZoom,
        //     payload: zoomSrc,
        //   });
        // }}
      >
        {renderImg()}
      </QuickPinchZoom>
    </>
  );
};

export default Img;
