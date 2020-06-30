export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, value) {
	const prefix = 'data-'
	name = prefix + name
	if (value) {
		return el.setAttribute(name, value)
	} else {
		return el.getAttribute(name)
	}
}