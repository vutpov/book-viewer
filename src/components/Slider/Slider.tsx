import React, { useRef } from "react";
import BasedSlider, { SliderProps as BasedSliderProps } from "rc-slider";
import { useInViewport } from "ahooks";
import "./Slider.less";

interface SliderProps extends BasedSliderProps {}

const Slider: React.FC<SliderProps> = (props) => {
  const { ...rest } = props;
  const ref = useRef(null);
  const inViewport = useInViewport(ref);

  return (
    <div
      ref={ref}
      style={{
        width: `100%`,
      }}
    >
      {/* @ts-ignore */}
      {inViewport ? <BasedSlider {...rest} /> : <React.Fragment />}
    </div>
  );
};

export default Slider;
