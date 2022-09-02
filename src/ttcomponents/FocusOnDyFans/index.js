/**
 * @name 关注组件
 */

// eslint-disable-next-line
Component({
  lifetimes: {},
  properties: {
    awemeId: {
      type: String,
      value: ''
    },
    // 判断组件的形态是 按钮 还是 文本，true：按钮，false：文本
    componentType: {
      type: Boolean,
      value: true
    },
    pageId: {
      type: String,
      value: 'xeknowdy#attention'
    },
    appId: {
      type: String,
      value: ''
    },
    buriedEvent: Function
  },
  methods: {
    handleClickBtn() {
      const { buriedEvent, pageId, appId } = this.data;
      buriedEvent?.(pageId, { msg: '点击关注按钮', appId });
    }
  }
});
