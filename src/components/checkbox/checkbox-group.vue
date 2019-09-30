<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { findComponentsDownward } from '../../utils/assist'
import Emitter from '../../mixins/emitter.js'

export default {
  name: 'iCheckboxGroup',
  mixins: [ Emitter ],
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentValue: this.value,
      children: []
    }
  },
  watch: {
    value () {
      this.updateModel(true)
    }
  },
  mounted () {
    this.updateModel(true) // 感觉这里不需要了...
  },
  methods: {
    // 当会动态增加 Checkbox 会执行： 子组件mounted -> 父组件updateModel
    // 但是动态删除 Checkbox 没做处理，虽然也没啥影响...
    updateModel (update) {
      this.children = findComponentsDownward(this, 'iCheckbox')

      if (this.children) {
        let { value } = this
        this.children.forEach(child => {
          child.model = value

          if (update) {
            child.currentValue = value.indexOf(child.label) >= 0
            child.group = true
          }
        })
      }
    },
    change (data) {
      this.currentValue = data
      this.$emit('input', data)
      this.$emit('on-change', data)
      this.dispatch('iFormItem', 'on-form-change', data)
    }
  }
}
</script>