<template>
  <div>
    <label v-if="label" :class="{ 'i-form-item-label-required': isRequired }">{{ label }}</label>
    <div>
      <slot></slot>
      <div v-if="validateState === 'error'" class="i-form-item-message">{{ validateMessage }}</div>
    </div>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter'
import schema from 'async-validator'

export default {
  name: "iFormItem",
  mixins: [ Emitter ],
  props: {
    label: { // 单个表单组件的标签文本，类似原生的 <label> 元素
      type: String,
      default: ""
    },
    prop: { // 对应表单域 Form 组件 model 里的字段，用于在校验或重置时访问表单组件绑定的数据
      type: String
    }
  },
  inject: ['form'],
  data () {
    return {
      isRequired: false,  // 是否为必填
      validateState: '', // 校验状态
      validateMessage: '', // 校验不通过时的提示信息
    }
  },
  computed: {
    fieldValue () {
      return this.form.model[this.prop]
    }
  },
  mounted () { // 组件渲染时，将实例缓存在 Form 中
    if (this.prop) { // 如果没有传入 prop，则无需校验，也就无需缓存
      this.dispatch('iForm', 'on-form-item-add', this)

      // 设置初始值，以便在重置时恢复默认值
      this.initialValue = this.fieldValue

      this.setRules()
    }
  },
  beforeDestroy () { // 组件销毁前，将实例从 Form 的缓存中移除
    this.dispatch('iForm', 'on-form-item-remove', this)
  },
  methods: {
    setRules () {
      let rules = this.getRules()
      if (rules.length > 0) {
        rules.every(rule => {
          this.isRequired = rule.required
        })
      }

      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    getRules () { // 从 Form 的 rules 属性中，获取当前 FormItem 的校验规则
      let formRules = this.form.rules
      formRules = formRules ? formRules[this.prop] : []
      return [].concat(formRules || [])
    },
    getFilteredRule (trigger) {
      let rules = this.getRules()
      return rules.filter(rule => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      })
    },
    /**
     * @param trigger 校验类型
     * @param callback 回调函数
     */
    validate (trigger, callback = function () {}) {
      let rules = this.getFilteredRule(trigger)

      if (!rules || rules.length === 0) {
        return true
      }

      this.validateState = 'validating'

      // 以下为 async-validator 库的调用方法
      let descriptor = {}
      descriptor[this.prop] = rules
      let validator = new schema(descriptor)

      let model = {}
      model[this.prop] = this.fieldValue
      validator.validate(model, {
        firstFields: true
      }, errors => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback(this.validateMessage)
      })
    },
    onFieldBlur () {
      this.validate('blur')
    },
    onFieldChange () {
      this.validate('change')
    },
    resetField () {
      this.validateState = ''
      this.validateMessage = ''

      this.form.model[this.prop] = this.initialValue
    }
  }
};
</script>

<style>
.i-form-item-label-required:before {
  content: '*';
  color: red;
}
.i-form-item-message {
  color: red;
}
</style>