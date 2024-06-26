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

export interface ImgProps {
  imageSrc?: string;
  showPlaceholder?: boolean;
  ignoreLoading?: boolean;
  [index: string]: any;
}

const maxScale = 3;

const Img: React.FC<ImgProps> = (props) => {
  const { style, showPlaceholder = true } = props;

  const imgRef = useRef<HTMLImageElement>();
  const zoomRef = useRef<QuickPinchZoom>();
  const {
    dispatch,
    imgProps: ctxImgProps = {
      ignoreLoading: false,
    },
  } = useContext(BookContext);
  let scaleRef = useRef(0);
  const dragXY = useRef({});

  const onUpdate = ({ x, y, scale }: UpdateAction) => {
    const { current: img } = imgRef as any;

    if (dragXY.current?.scale !== scale) {
      dragXY.current = { x, scale, y };
    }

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      img.style.setProperty("transform", value);
    }

    scaleRef.current = roundNumber(scale);
  };

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

    let resultProps = {
      ...imgProps,
      style: {
        ...style,
        ...placeholderStyle,
      },
      src: Boolean(ctxImgProps.ignoreLoading) ? props.imageSrc : src,
    };

    if (isLoading && Boolean(ctxImgProps.ignoreLoading) === false) {
      resultProps = {
        ...resultProps,
        src: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif",
      };
    }

    if (error) {
      resultProps = {
        ...resultProps,
        src: `https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg`,
      };
    }

    // console.log(
    //   {
    //     error,
    //     isLoading,
    //     ctxImgProps,
    //     resultProps,
    //   },
    //   `hello`
    // );

    return <img {...resultProps} />;
  };

  return (
    <>
      <QuickPinchZoom
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

        // inertia={false}
        lockDragAxis={true}
        // shouldCancelHandledTouchEndEvents={true}

        onZoomUpdate={() => {
          let zoomSrc = scaleRef.current == 1 ? null : props.imageSrc;

          dispatch({
            type: ActionType.changeZoom,
            payload: zoomSrc,
          });
        }}
      >
        {renderImg()}
      </QuickPinchZoom>
    </>
  );
};

export default Img;
