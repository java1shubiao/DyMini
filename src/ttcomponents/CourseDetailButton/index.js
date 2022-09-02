/**
 * @name 进入课程
 */

// eslint-disable-next-line
Component({
  lifetimes: {},
  properties: {
    subscribeMessage: Function
  },
  methods: {
    subscribleMessage() {
      const _this = this;
      tt.requestSubscribeMessage({
        tmplIds: ['MSG155624bdbffa02a62100d261ffb9e3ec606bd15924'],
        success(res) {
          console.log('订阅消息成功：', res);
          _this.data.subscribeMessage();
        },
        fail(res) {
          console.log('消息订阅失败：', res);
        }
      });
    }
  }
});
