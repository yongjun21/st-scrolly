import React from 'react'

export default StScrolly

declare const StScrolly: React.FunctionComponent<{
  className?: string;
  windowTop?: number;
  windowHeight?: number;
  triggerOffset?: number;
  dontUseSticky?: boolean;
  renderBackground?: StScrolly.RenderProp;
  renderForeground?: StScrolly.RenderProp;
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
    enter: ExposedScope.enter;
    exit: ExposedScope.exit;
    progress: ExposedScope.progress
  }

  export namespace ExposedScope {
    export type enter = (index: number, distance?: number, offset?: number) => number
    export type exit = (index: number, distance?: number, offset?: number) => number
    export interface progress {
      (endEarly?: boolean, offset?: number): number;
      between (startIndex?: number, endIndex?: number): progress;
      at (index?: number): progress;
    }
  }
}

export function clamp (value: number, min: number, max: number): number
