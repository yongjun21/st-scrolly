---
home: true
heroImage: /assets/scrollytelling-demo.gif
actionText: Get started →
actionLink: /guide/
features:
- title: Modern
  details: "Uses `position: sticky`. No unsightly jerk when sticky content \"snap\" into position. Fallbacks to `position: fixed` in older browsers."
- title: Declarative
  details: "Experiment with different scrollytelling formats effortlessly using our simple declarative API."
- title: Flexible
  details: "Uses `slots` and `render props` giving user the flexibility to include any content and implement transition in different ways."
footer: MIT Licensed | Copyright © 2018-present Yong Jun
---

## Installing

```sh
npm install @st-graphics/scrolly
```

or

```sh
npm install @st-graphics/react-scrolly
```

## Usage

### With Vue
```vue
<template>
  <st-scrolly>
    <template v-slot:background="{slideIndex}"><!-- your sticky content--></template>
    <!-- your slides content -->
  </st-scrolly>
</tempate>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/scrolly'

export default {
  components: {StScrolly}
}
</script>
```

### With React
```jsx
import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

export function (props) {
  const renderBackground = ({slideIndex}) => (
    <!-- your sticky content -->
  )
  return (
    <StScrolly renderBackground={renderBackground}>
      <!-- your slides content-->
    </StScrolly>
  )
}
```
