export default {
  functional: true,
  props: {
    row: Object, // 当前行数据
    column: Object, // 当前列数据
    index: Number, // 当前第几行
    render: Function // render函数
  },
  render (h, ctx) {
    let params = {
      row: ctx.props.row,
      column: ctx.props.column,
      index: ctx.props.index
    }

    return ctx.props.render(h, params)
  }
}