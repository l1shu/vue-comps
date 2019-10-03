// notification.js 并不是最终的文件，它只是对 alert.vue 添加了一个方法 newInstance
// alert.vue 会被 Webpack 的 vue-loader 编译，把 template 编译为 Render 函数，最终就会成为一个 JS 对象

import Alert from './alert.vue'
import Vue from 'vue'

Alert.newInstance = properties => {
  let props = properties || {}

  let instance = new Vue({
    data: props,
    render (h) {
      return h(Alert, {
        props
      })
    }
  })

  let component = instance.$mount()
  document.body.appendChild(component.$el)

  let alert = instance.$children[0]

  return {
    add (noticeProps) {
      alert.add(noticeProps)
    },
    remove (name) {
      alert.remove(name)
    }
  }
}

export default Alert