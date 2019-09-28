<template>
  <input
    type="text"
    :value="currentValue"
    @input="handleInput"
    @blur="handleBlur"
  >
</template>

<script>
import Emitter from '../../mixins/emitter'

export default {
  name: 'iInput',
  mixins: [ Emitter ],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value', // default
    event: 'input' // default
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    handleInput (e) {
      let value = e.target.value
      this.currentValue = value
      this.$emit('input', value)

      this.dispatch('iFormItem', 'on-form-change', value)
    },
    handleBlur () {
      this.dispatch('iFormItem', 'on-form-blur', this.currentValue)
    }
  }
}
</script>