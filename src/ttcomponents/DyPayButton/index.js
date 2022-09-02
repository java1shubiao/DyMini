/**
 * @name 自定义交易组件
 */

// eslint-disable-next-line
Component({
  properties: {
    mode: {
      type: Number,
      value: 1
    },
    goodsId: {
      type: String,
      value: ''
    },
    goodsType: {
      type: Number,
      value: 1
    },
    orderStatus: Number,
    orderId: {
      type: String,
      value: '0'
    },
    userId: String,
    skuId: String,
    refundId: String,
    refundTotalAmount: Number,
    marketingReady: Boolean,
    customClass: {
      type: String,
      value: ''
    },
    getUserInfo: {
      type: Object,
      value: () => {}
    },
    appId: {
      type: String,
      value: ''
    },
    goodsInfo: {
      type: Object,
      value: () => {}
    },
    skuList: {
      type: Object,
      value: () => {}
    },
    userInfo: {
      type: Object,
      value: () => {}
    },
    toLogin: Function,
    goodsName: String,
    studyTime: Number,
    pageBuried: Function,
    subscribeMessage: Function
  },
  data: {},
  // lifetimes必须加，否则会报错，uni-mp-toutiao的bug
  lifetimes: {},
  methods: {
    getGoodsInfo() {
      return new Promise(resolve => {
        // 参数有误的时候才会埋点
        const otherParam = {
          app_id: this.data?.goodsInfo?.app_id,
          resource_id: this.data?.goodsInfo?.resource_id,
          spu_id: this.data?.goodsInfo?.spu_id,
          sku_id: this.data?.skuList?.[0]?.sku_id,
          b_user_id: this.data?.userInfo?.bUserId
        };
        if (
          !(
            otherParam.app_id &&
            otherParam.resource_id &&
            otherParam.spu_id &&
            otherParam.sku_id &&
            otherParam.b_user_id
          )
        ) {
          this.data.pageBuried('goods#dy_pay_buttopn', false, '', otherParam);
        }
        resolve({
          currentPrice: 1,
          minLimits: 2,
          maxLimits: 10,
          dateRule: '',
          goodsName: '循礼门M+丨【释集烤肉】99元  原价206.4元超值套餐',
          goodsPhoto:
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ibaotu.com%2Fgif%2F19%2F48%2F47%2F76Z888piCd6W.gif%21fwpaa50%2Ffw%2F700&refer=http%3A%2F%2Fpic.ibaotu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644654365&t=5fc9b5fdad0a16264a9a9c09c14b3af9',
          goodsLabels: [{ type: 'REFUND_ANYTIME' }, { type: 'BOOK_IN_ADVANCE', value: 98 }],
          extra: otherParam
        });
      });
    },

    onError(e) {
      const { errNo, errMsg } = e.detail;
      console.log('errNo---', errNo, 'errMsg', errMsg);
    },

    onPay(options) {
      const { status, orderId, outOrderNo, result } = options.detail;
      console.log('onPay', status, orderId, outOrderNo, result);
      if (this.data.mode === 2) {
        if (status === 'success') {
          const { code } = result;
          if (code === 0) {
            this.handleSubscribeMessage();
            // 支付成功
            tt.navigateTo({
              url: `usr://pages-main-affiliate/pages/payCompeletepage/index?app_id=${this.data.appId}&order_id=${outOrderNo}&title=${this.data.goodsInfo.goods_name}&from_order=false`
            });
          } else {
            // 支付失败（超时、取消、关闭）
            tt.navigateTo({
              url: `usr://pages-main-affiliate/pages/order/order-detail?order_id=${outOrderNo}&app_id=${this.data.appId}`
            });
          }
        } else {
          const { errMsg } = result;
          console.log('errMsg-----: ', errMsg);
        }
      } else if (this.data.mode === 1) {
        if (status === 'success') {
          const { code } = result;
          if (code === 0) {
            const jumpUrl = `/pages-main-affiliate/pages/payCompeletepage/index?app_id=${this.data.appId}&order_id=${outOrderNo}&title=${this.data.goodsName}&spu_id=${this.data.goodsInfo.spu_id}&from_order=true`;
            tt.navigateTo({
              url: jumpUrl
            });
          } else {
            const jumpUrl = `/pages-main-affiliate/pages/order/order-detail?order_id=${outOrderNo}&app_id=${this.data.appId}`;
            tt.navigateTo({
              url: jumpUrl
            });
          }
        } else {
          console.log('待支付失败');
        }
      }
    },

    userLogin(event) {
      console.log('place order', event);
      return new Promise((resolve, reject) => {
        if (!this.data.userInfo.isAuth) {
          // 失败
          this.data.toLogin(resolve, reject);
        } else {
          // 成功
          resolve();
        }
      });
    },
    applyRefund() {
      const extra = {
        order_id: this.data.orderId,
        app_id: this.data.appId,
        user_id: this.data.userId,
        sku_id: this.data.skuId,
        study_time: this.data.studyTime
      };
      return new Promise(resolve => {
        resolve(extra);
      });
    },
    handleRefund(event) {
      const { status, result } = event.detail;
      if (status === 'success') {
        const { refundId, outRefundNo } = result;
        console.log(refundId, outRefundNo);
      } else {
        const { errMsg } = result;
        console.log(errMsg);
      }
    },
    handleSubscribeMessage() {
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
