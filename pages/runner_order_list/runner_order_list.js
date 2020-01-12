
const app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var order_data_list = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "待支付", "待接单", "待送达",'待确认', "待评价", "已完成", "已取消"],
    activeIndex: 0,
    order_data: [],
    order_data_list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getmyorder_list();
    for (var i = 0; i < 5; i++) {
      this.getmyorder_list_bytype(i);
    }
    console.log(JSON.stringify(this.data.order_data_list));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  checkprogress: function () {
    wx.navigateTo({
      url: 'progress/progress'
    });
  },
  getmyorder_list() {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/order/list.do',
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      header: {
        'Cookie': wx.getStorageSync('cookieKey')
      },
      data: {

      },
      success: function (res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          var order_data = res.data.data.data;
          for (var i = 0; i < order_data.length; i++) {
            var orderstate = order_data[i].order.orderstate;
            order_data[i]['status_name'] = that.data.tabs[orderstate + 1]
          }
          console.log(order_data);
          that.setData({
            order_data: order_data
          })
        }
      },
      fail: function (res) {
        console.log("返回错误" + res);
      },
      complete: function (res) {
        console.log("启动请求" + res);
      },
    })
  },
  getmyorder_list_bytype(type) {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/order/list.do?orderstate=' + type,
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      header: {
        'Cookie': wx.getStorageSync('cookieKey')
      },
      success: function (res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          var types = 'type' + type;
          order_data_list[types] = res.data.data.data;
          if (order_data_list[types] != null) {
            for (var i = 0; i < order_data_list[types].length; i++) {
              order_data_list[types][i]['status_name'] = that.data.tabs[type + 1]
            }
          }
          console.log(JSON.stringify(order_data_list));
          that.setData({
            order_data_list: order_data_list
          })
        }
      },
      fail: function (res) {
        console.log("返回错误" + res);
      },
      complete: function (res) {
        console.log("启动请求" + res);
      },
    })
  },
  to_detail: function (event) {
    var that = this;
    var oid = event.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../runner_order_detail/runner_order_detail?order_id=' + oid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})