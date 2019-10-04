# API

## Props

```ts
interface Props {
  triggerOffset: number; // default: 0
  windowTop: number; // default: 0
  windowHeight: number; //default: window.innerHeight
}
```

### `triggerOffset`

Refer to [guide](/guide/#using-triggeroffset-props). `triggerOffset` is applied "globally". (i.e. if you set a -100 offset, **every** slide transition will be triggered 100px earlier)

### `windowTop`

Refer to [guide](/guide/#using-windowheight-windowtop-props).

### `windowHeight`

Refer to [guide](/guide/#using-windowheight-windowtop-props)


## Slot scope

```ts
interface ExposedScope {
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

interface EnterExitFunction {
  (index: number, distance?: number, offset?: number): number; // returns t ∈ [0, 1]
}

interface ProgressFunction {
  (exitOnBottomAlign?: boolean, offset?: number): number; // returns t ∈ [0, 1]
  between (startIndex?: number, endIndex?: number): ProgressFunction;
  at (index?: number): ProgressFunction;
}
```

### `slideIndex`

Refer to [guide](/guide/#using-slideindex-from-slot-scope).

### `slideCount`

Total number of slides in default slot

### `scrollPosition`

Scroll offset in px. Measured from top of the **first slide** to the to top of sticky window. 

### `scrollLength`

Total height of all slides. `position: sticky` is engaged when 0 <= scrollPosition <= scrollLength

### `fromPrevSlide`

Distance from top of the **current slide** (or bottom of previous slide) to top of sticky window less `triggerOffset`. Another way to interprete this value is the number of px scrolled since `slideIndex` last incremented.

### `toNextSlide`

Distance from top of sticky window to bottom of **current slide** (or top of next slide) less `triggerOffset`. Another way to interprete this value is the number of px we need to scroll for `slideIndex` to increment.


### `enter`

Refer to [guide](/guide/#using-enter-exit-from-slot-scope). `enter` accepts a third `offset` parameter that modifies the behavior of the function similarly to `triggerOffset` prop above. You can fine-tune where the enter transition starts and ends by trying different combination of `distance` and `offset`.

### `exit`

Refer to [guide](/guide/#using-enter-exit-from-slot-scope). `exit` accepts a third `offset` parameter that modifies the behavior of the function similarly to `triggerOffset` prop above. You can fine-tune where the exit transition starts and ends by trying different combination of `distance` and `offset`.

### `progress`

Refer to [guide](/guide/#using-progress-from-slot-scope). `progress` accepts a second `offset` parameter that modifies the behavior of the function similarly to `triggerOffset` prop above. 
