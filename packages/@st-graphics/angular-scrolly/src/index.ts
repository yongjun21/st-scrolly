import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef
} from '@angular/core'

declare const window: any
type Callback = (...args: any[]) => void

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

const supportsSticky = (function () {
  if (typeof window === 'undefined') return true
  const supports = window.CSS && window.CSS.supports
  if (!supports) return false
  return supports('position', 'sticky') || supports('position', '-webkit-sticky')
})()

@Component({
  selector: 'st-scrolly',
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export default class StScrolly implements OnInit, OnDestroy {

  @Input() windowHeight: number
  @Input() windowTop: number = 0
  @Input() triggerOffset: number = 0
  @Input() dontUseSticky: boolean

  @Input() backgroundTemplate: TemplateRef<ExposedScope>
  @Input() foregroundTemplate: TemplateRef<ExposedScope>
  @Input() slidesTemplate: TemplateRef<ExposedScope>

  @ViewChild('slides', {static: true}) slideContainer: ElementRef

  windowHeight_: number
  slideHeights: number[]
  scrollPosition: number

  constructor() {
    const windowHeight = this.windowHeight || 0
    this.windowHeight_ = windowHeight
    this.slideHeights = [windowHeight],
    this.scrollPosition = -1
  }

  get scrollCheckpoints () {
    return this.slideHeights.reduce((arr, h) => {
      arr.push(arr[arr.length - 1] + h)
      return arr
    }, [0])
  }
  
  get scrollLength () {
    return this.scrollCheckpoints[this.scrollCheckpoints.length - 1]
  }
  
  get active () {
    const {scrollPosition} = this
    return scrollPosition >= 0 && scrollPosition < this.scrollLength
  }
  
  get exposedScope (): ExposedScope {
    const {scrollPosition, scrollCheckpoints, scrollLength, triggerOffset, windowHeight_} = this
    const offsetPosition = scrollPosition - triggerOffset
    const slideIndex = scrollCheckpoints.filter(h => offsetPosition >= h).length - 1
    const fromPrevSlide = offsetPosition < 0 ? Infinity
                        : offsetPosition - scrollCheckpoints[slideIndex]
    const toNextSlide = offsetPosition >= scrollLength ? Infinity
                      : scrollCheckpoints[slideIndex + 1] - offsetPosition

    const enter = (index: number, distance = 0, offset = triggerOffset) => {
      if (index < 0) index += scrollCheckpoints.length - 1
      const v1 = scrollCheckpoints[index]
      const v0 = v1 - distance
      const v = scrollPosition - offset
      if (distance === 0) return v >= v1 ? 1 : 0
      return clampedInterpolate(v, v0, v1)
    }
    const exit = (index: number, distance = 0, offset = triggerOffset) => {
      if (index < 0) index += scrollCheckpoints.length - 1
      const v0 = scrollCheckpoints[index + 1]
      const v1 = v0 - distance
      const v = scrollPosition - offset
      if (distance === 0) return v >= v0 ? 0 : 1
      return clampedInterpolate(v, v0, v1)
    }

    function getProgress (start: number, end: number) {
      const progress = (endEarly = false, offset = triggerOffset) => {
        const v0 = scrollCheckpoints[start]
        const v1 = scrollCheckpoints[end] - (endEarly ? windowHeight_ : 0)
        const v = scrollPosition - offset
        return clampedInterpolate(v, v0, v1)
      }
      progress.between = (start = 0, end = scrollCheckpoints.length - 1) => {
        if (start < 0) start += scrollCheckpoints.length - 1
        if (end < 0) end += scrollCheckpoints.length - 1
        return getProgress(start, end)
      }
      progress.at = (index: number) => {
        if (index < 0) index += scrollCheckpoints.length - 1
        return getProgress(index, index + 1)
      }
      return progress
    }

    return {
      slideIndex,
      slideCount: scrollCheckpoints.length - 1,
      scrollPosition,
      scrollLength,
      fromPrevSlide,
      toNextSlide,
      enter,
      exit,
      progress: getProgress(0, scrollCheckpoints.length - 1)
    }
  }
  
  get stickyStyle () {
    let position = 'fixed'
    let top = this.windowTop + 'px'
    let bottom = 'auto'
    if (!this.dontUseSticky && supportsSticky) {
      position = 'sticky'
    } else if (this.scrollPosition < 0) {
      // align top
      position = 'absolute'
      top = '0'
    } else if (this.scrollPosition >= this.scrollLength - this.windowHeight_) {
      // align bottom
      position = 'absolute'
      top = 'auto'
      bottom = '0'
    }
    return {
      position,
      top,
      bottom,
      height: this.windowHeight ? (this.windowHeight + 'px') : '100vh'
    }
  }

  scrollTo (index: number, triggerBased = false) {
    if (index < 0 || index > this.slideHeights.length) return null
    const initialPosition = window.scrollY + this.slideContainer.nativeElement.getBoundingClientRect().top - this.windowTop
    const targetOffsetPosition = this.scrollCheckpoints[index] + (triggerBased ? this.triggerOffset : 0)
    return initialPosition + targetOffsetPosition + 1
  }
  
  measure () {
    const $slides = this.slideContainer.nativeElement.children
    this.slideHeights = Array.prototype.map
      .call($slides, (el: Element) => el.getBoundingClientRect().height)
  }
  
  handleScroll () {
    this.measure()
    this.scrollPosition = this.windowTop - this.slideContainer.nativeElement.getBoundingClientRect().top
  }
  
  handleResize () {
    this.measure()
    this.scrollPosition = this.windowTop - this.slideContainer.nativeElement.getBoundingClientRect().top
    this.windowHeight_ = this.windowHeight || window.innerHeight
  }

  ngOnInit () {
    this.handleResize()
    this.handleResize = frameRateLimited(this.handleResize, this)
    this.handleScroll = frameRateLimited(this.handleScroll, this)
    window.addEventListener('resize', this.handleResize, {capture: true, passive: true})
    window.addEventListener('scroll', this.handleScroll, {capture: true, passive: true})
  }

  ngOnDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }
}

export function clamp (value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function frameRateLimited (cb: Callback, context?: any) {
  let ready = true
  let args: IArguments
  function wrapped () {
    args = arguments
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.apply(this, args)
      ready = true
    })
  }
  return context ? wrapped.bind(context) : wrapped
}

function clampedInterpolate (v: number, v0: number, v1: number) {
  return Math.min(Math.max((v - v0) / (v1 - v0), 0), 1)
}
