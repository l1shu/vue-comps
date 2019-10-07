// 由一个组件，向上找到最近的指定组件
function findComponentUpward (context, componentName) {
  let parent = context.$parent
  let name = parent && parent.$options.name // 原句：let name = parent.$options.name

  while(parent && (!name || [componentName].indexOf(name) < 0)) { // 这里应该是考虑到undefined以及componentName不为String的情况
    parent = parent.$parent
    if (parent) {
      name = parent.$options.name
    }
  }

  return parent
}

// 由一个组件，向上找到所有的指定组件
function findComponentsUpward (context, componentName) {
  let parents = []
  let parent = context.$parent

  if (parent) {
    if (parent.$options.name === componentName) {
      parents.push(parent)
    }
    return parents.concat(findComponentsUpward(parent, componentName))

  } else {
    return []
  }
}

// 由一个组件，向下找到最近的指定组件
function findComponentDownward (context, componentName) {
  const children = context.$children
  let child = null

  if (children.length) {
    for (const _child of children) {
      const name = _child.$options.name

      if (name === componentName) {
        child = _child
        break
      } else {
        child = findComponentDownward(_child, componentName);
        if (child) break
      }
    }
  }
  return child
}

// 由一个组件，向下找到所有指定的组件
function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {

    if (child.$options.name === componentName) components.push(child)

    const foundChilds = findComponentsDownward(child, componentName)

    return components.concat(foundChilds)

  }, [])
}

// 由一个组件，找到指定组件的兄弟组件
function findBrothersComponents (context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName
  })
  let index = res.findIndex(item => item._uid === context._uid)
  if (exceptMe) res.splice(index, 1)
  return res
}

function typeOf (obj) {
  let toString = Object.prototype.toString
  let map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  }
  return map[toString.call(obj)]
}

// deepCopy
function deepCopy (data) {
  let t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    data.forEach(item => {
      o.push(deepCopy(item))
    })
  } else if (t === 'object') {
    for (let key in data) {
      o[key] = deepCopy(data[key])
    }
  }
  return o
}

export {
  findComponentUpward,
  findComponentsUpward,
  findComponentDownward,
  findComponentsDownward,
  findBrothersComponents,
  deepCopy
}