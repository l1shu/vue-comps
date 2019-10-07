<template>
  <ul class="tree-ul">
    <li class="tree-li">
      <span class="tree-expand" @click="handleExpand">
        <span v-if="data.children && data.children.length && !data.expand">+</span>
        <span v-if="data.children && data.children.length && data.expand">-</span>
      </span>
      <i-checkbox
        v-if="showCheckbox"
        :value="data.checked"
        @input="handleCheck"
      ></i-checkbox>
      <span>{{ data.title }}</span>
      <tree-node
        v-if="data.expand"
        v-for="(item, index) in data.children"
        :key="index"
        :data="item"
        :show-checkbox="showCheckbox"
      ></tree-node>
    </li>
  </ul>
</template>

<script>
import iCheckbox from '../checkbox/checkbox.vue'
import { findComponentUpward } from '../../utils/assist.js'

export default {
  name: 'TreeNode',
  components: { iCheckbox },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'data.children': {
      handler (data) {
        if (data) {
          // let checkedAll = data.every(item => item.checked) 
          let checkedAll = !data.some(item => !item.checked) // 这样写可以提前停止遍历~
          this.$set(this.data, 'checked', checkedAll)
        }
      },
      deep: true
    }
  },
  data () {
    return {
      tree: findComponentUpward(this, 'Tree')
    }
  },
  methods: {
    handleExpand () {
      // 追根溯源，要修改的 this.data 事实上是 tree.vue 的 cloneData。
      // cloneData 里的节点数据，是不一定含有 expand 或 checked 字段的，
      // 如果不含有，直接通过 this.data.expand 修改，这个 expand 就不是可响应的数据，Vue.js 是无法追踪到它的变化，视图自然不会更新，
      // 而 $set 的用法就是对可响应对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
      // 总结来说，如果 expand 字段一开始是存在的（不管 true 或 false），不管用哪种方式修改都是可以的，否则必须用 $set 修改，
      // 结合起来，干脆直接用 $set 了。
      this.$set(this.data, 'expand', !this.data.expand)

      if (this.tree) {
        this.tree.emitEvent('on-toggle-expand', this.data)
      }
    },
    handleCheck (checked) {
      this.updateTreeDown(this.data, checked);

      if (this.tree) {
        this.tree.emitEvent('on-check-change', this.data);
      }
    },
    updateTreeDown (data, checked) {
      this.$set(data, 'checked', checked);

      if (data.children && data.children.length) {
        data.children.forEach(item => {
          this.updateTreeDown(item, checked);
        });
      }
    }
  }
}
</script>

<style>
  .tree-ul, .tree-li{
    list-style: none;
    padding-left: 10px;
  }
  .tree-expand{
    cursor: pointer;
  }
</style>