import React from 'react'

export default StScrolly

declare const StScrolly: React.FunctionComponent<{
  className?: string,
  windowTop?: number,
  windowHeight?: number,
  triggerOffset?: number,
  dontUseSticky?: boolean,
  renderBackground?: StScrolly.RenderProp,
  renderForeground?: StScrolly.RenderProp
}>

declare namespace StScrolly {
  interface RenderPropFunc {
    (props: ExposedScope): React.ReactNode;
  }

  export type RenderProp = React.ReactNode | RenderPropFunc

  export interface ExposedScope {
    slideIndex: number;
    slideCount: number;
    scrollPosition: number;
    scrollLength: number;
    fromPrevSlide: number;
    toNextSlide: number;
    enter: EnterExitFunction;
    exit: EnterExitFunction;
    progress: ProgressFunction;
  }

  export interface EnterExitFunction {
    (index: number, distance?: number, offset?: number): number;
  }

  export interface ProgressFunction {
    (endEarly?: boolean, offset?: number): number;
    between (startIndex?: number, endIndex?: number): ProgressFunction;
    at (index?: number): ProgressFunction;
  }
}

export function clamp (value: number, min: number, max: number): number
