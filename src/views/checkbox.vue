<template>
  <div>
    <h3>组合多选框组件——CheckboxGroup & Checkbox</h3>

    <i-checkbox v-model="single">单独选项</i-checkbox>

    <br />

    数据：{{ single }}
    <br />
    <br />

    <i-checkbox-group v-model="multiple">
      <i-checkbox v-for="item in list" :key="item.label" :label="item.label">{{item.text}}</i-checkbox>
    </i-checkbox-group>

    <br />
    数据：{{ multiple }}
  </div>
</template>
<script>
import iCheckboxGroup from "../components/checkbox/checkbox-group.vue";
import iCheckbox from "../components/checkbox/checkbox.vue";
export default {
  // name: 'checkbox',
  components: { iCheckboxGroup, iCheckbox },
  data() {
    return {
      single: false,
      multiple: ["option1"],
      list: [
        {
          label: 'option1',
          text: '选项1'
        },
        {
          label: 'option2',
          text: '选项2'
        }
      ]
    }
  },
  mounted () {
    setTimeout(() => {
      this.list.pop()
    }, 3000)
  }
};
</script>