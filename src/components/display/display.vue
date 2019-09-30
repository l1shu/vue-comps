<template>
  <div ref="display"></div>
</template>

<script>
import Vue from 'vue'
import randomStr from '../../utils/random_str.js'

export default {
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      html: '',
      js: '',
      css: '',

      comp: null,
      id: randomStr()
    }
  },
  watch: {
    code () { // 当 this.code 更新时，整个过程要重新来一次
      this.destroyCode();
      this.renderCode();
    }
  },
  mounted () {
    this.renderCode()
  },
  beforeDestroy () {
    this.destroyCode()
  },
  methods: {
    /**
     * @param source .vue 文件代码，即 props: code
     * @param type 分割的部分，也就是 template、script、style
     */
    getSource (source, type) {
      let regex = new RegExp(`<${type}[^>]*>`)
      let openingTag = source.match(regex)

      if (!openingTag) return ''
      else openingTag = openingTag[0]

      return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`))
    },
    splitCode () {
      let script = this.getSource(this.code, 'script').replace(/export default/, 'return ')
      let style = this.getSource(this.code, 'style')
      let template = '<div id="app">' + this.getSource(this.code, 'template') + '</div>' // 外层套了一个 <div id="app">，这是为了容错，有时使用者传递的 code 可能会忘记在外层包一个节点，没有根节点的组件，是会报错的

      this.js = script // 此时的js是字符串，但是extend 接收的选项可不是字符串，而是一个对象类型，那就要先把 this.js 转为一个对象
      this.css = style
      this.html = template
    },
    renderCode () {
      this.splitCode()

      if (this.html && this.js) {
        let parseStrToFunc = new Function(this.js)() // this.js 转为一个对象

        parseStrToFunc.template = this.html

        let Component = Vue.extend( parseStrToFunc )
        this.comp = new Component().$mount() // 模板将被渲染为文档之外的的元素

        this.$refs.display.appendChild(this.comp.$el)

        if (this.css) {
          let style = document.createElement('style')
          style.type = 'text/css'
          style.id = this.id
          style.innerHTML = this.css
          document.getElementsByTagName('head')[0].appendChild(style)
        }
      }
    },
    destroyCode () {
      const $target = document.getElementById(this.id)
      if ($target) $target.parentNode.removeChild($target)

      if (this.comp) {
        this.$refs.display.removeChild(this.comp.$el)
        this.comp.$destroy()
        this.comp = null
      }
    }
  }
}
</script>