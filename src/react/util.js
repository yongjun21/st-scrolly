export function omit (obj, ...props) {
  const clone = Object.assign({}, obj)
  props.forEach(prop => {
    delete clone[prop]
  })
  return clone
}
